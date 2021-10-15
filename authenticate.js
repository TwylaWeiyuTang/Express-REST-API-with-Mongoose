// we will use this file to store the authentication strategies that we will configure
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
// serializeUser determines which data of the user object should be stored in the session.
passport.deserializeUser(User.deserializeUser());
// deserializeUser is used to retrieve user data from session