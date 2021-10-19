var express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// sign up a new user
router.post('/signup', function(req,res,next) {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => { // check if the username sent from request exists
  // in the database
    if (err) {
      res.status = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      passport.authenticate('local')(req,res, () => {
        res.status = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'});
      }); // we use passport authenticate local to authenticate the
      // same user that just registered to ensure the user registration was successful
    } 
  });
});

router.post('/login', passport.authenticate('local'), (req,res) => {
  // if the pass.authenticate('local') fails, it will automatically send a failure reply to 
  // the client and no following code will be executed
  const token = authenticate.getToken({_id: req.user._id});
  res.status = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.get('/logout', (req,res) => {
  if (req.session) {
    req.session.destroy(); // the session is destroyed means the information of this session 
    // from the server side is removed 
    res.clearCookie('session-id'); // we are asking client to delete this cookie from the client
    // side in the replying message
    res.redirect('/'); // redirect the user to the homepage
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
