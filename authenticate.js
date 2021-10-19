// we will use this file to store the authentication strategies that we will configure
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
// serializeUser determines which data of the user object should be stored in the session.
passport.deserializeUser(User.deserializeUser());
// deserializeUser is used to retrieve user data from session

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, 
        {expiresIn: 3600}); // the token will expires in 3600 seconds
        // this will helps us to create jsonwebtoken
};

const opts = {};
// this option specifies how the jsonwebtoken should be extracted from the incoming request message
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// secret key will be used within the strategy for sign-in
opts.secretOrKey = config.secretKey;

//jsonwebtoken passport strategy configuration
exports.jwtPassport = passport.use(new JwtStrategy(opts, 
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
                // done is a callback that the passport will pass into your strategy
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));


exports.verifyUser = passport.authenticate('jwt', {session: false});
// the strategy we are going to verify user is jwt we just created, and there will be no session

