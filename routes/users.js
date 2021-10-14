var express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// sign up a new user
router.post('/signup', function(req,res,next) {
  User.findOne({username: req.body.username}) // check if the username sent from request exists
  // in the database
  .then((user) => {
    if (user != null) {
      var err = new Error('User ' + req.body.username + ' already exists');
      err.status = 403;
      next(err);
    }
    else {
      return User.create({
        username: req.body.username,
        password: req.body.password
      });
    }
  })
  .then((user) => {
    res.status = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'Registration Successful', user: user});
  }, (err) => next(err)) // if the promise doesn't resolve successfully, then it will be handled
  // by this error function
  .catch((err) => next(err));
});

router.post('/login', (req,res,next) => {
  if (!req.session.user) { // means user is not logged in 
    var authHeader = req.headers.authorization;

    if (!authHeader) { // this means our cliend did not include the username and the password into
      // the authentication header
      var err = new Error('You are not authenticated!');
  
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
    }
  
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    // the result of the above code will be an array containing a username and password
    // buffer enables you to split a string value
    // will split the string into an array, and the first element of the array will be basic
    // the second element of array will be base64 encoded string
    // so [1] means we are only looking for the second element in the array
  
    var username = auth[0];
    var password = auth[1];
    
    User.findOne({username: username})
    .then((user)=> {
      if (user === null) {
        var err = new Error('User ' + username + ' does not exist');

        err.status = 403;
        next(err);
      }
      else if (user.password !== password) {
        var err = new Error('Your password is incorrect!');
    
        err.status = 403;
        next(err);
      }
      else if (user.username === username && user.password === password) {
        req.session.user = 'authenticated';
        //res.cookie('user', 'admin', {signed: true}) we set up the cookie, the user is admin
        // all the outgoing requests will automatically include this cookie
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated!');
      }
    })
    .catch((err) => next(err));
  }
  else { // this situation means the user is already logged in
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!');
  }
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
