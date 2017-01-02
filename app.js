var bodyParser = require('body-parser'), 
  cookieParser = require('cookie-parser'),
  config = require('./config/config'),
  express = require('express'),
  favicon = require('serve-favicon'),
  helmet = require('helmet'),
  morgan = require('morgan'),
  passport = require('passport'),
  path = require('path'),
  pathUtils = require('./utils/path-util');
  
  require('./config/mongoose');

var index = require('./app/routes/core'),
  users = require('./app/routes/users');

var app = express();

pathUtils.getGlobbedPaths(path.join(__dirname, '../models/*.js'))
  .forEach(function(routePath) {
    require(path.resolve(routePath))(app);
  });

// Showing stack errors
app.set('showStackErrror', true);

// Enable jsonp
app.enable('jsonp callback');

// view engine setup
app.set('views', path.join(__dirname, 'app', 'views'));
app.set('view engine', 'jade');


// Environment dependent middleware
if (config.environment === 'development') {

  // Enable logger (morgan)
  app.use(morgan('dev'));

  // Disable views cache
  app.set('view cache', false);

} else if (config.environment === 'production') {
    app.locals.cache = 'memory';
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// use passport session
app.use(passport.initialize());
app.use(passport.session());

// Use helmet to secure Express headers
app.use(helmet.frameguard());
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen());
app.disable('x-powered-by');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

pathUtils.getGlobbedPaths(path.join(__dirname, '../routes/*.js'))
  .forEach(function(routePath) {
    require(path.resolve(routePath))(app);
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
