var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
const Promotions = require('./models/promotions');
const Leaders = require('./models/leaders');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('Connected correctly to server');
}, (err) => {
  console.log(err);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12345-67890-09876-54321'));
// we are passing a secret key to use the signed cookies

// user basic authentication
function auth(req,res,next) {
  console.log(req.signedCookies);

  if (!req.signedCookies.user) { // if the incoming request does not include the user field in the signed
    //cookies, then the user has not been authorized yet
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
  
    if (username === 'admin' && password === 'password') {
      res.cookie('user', 'admin', {signed: true}) // we set up the cookie, the user is admin
      // all the outgoing requests will automatically include this cookie
      next();
    }
    else {
      var err = new Error('You are not authenticated!');
  
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
    }
  }
  else {
    if (req.signedCookies.user === 'admin') {
      next();
    }
    else {
      var err = new Error('You are not authenticated!');
      err.status = 401;
      next(err);
    }
  }
}

app.use(auth); // before the user can access any file from the public folder, we need to authenticate them
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
