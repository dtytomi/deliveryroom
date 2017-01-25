var express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var passport = require('passport');
var cors = require('cors'),
  helmet = require('helmet'),
  methodOverride = require('method-override'),
  mongoose = require('mongoose'),
  session        = require('express-session'),
  MongoStore     = require('connect-mongo')(session);
  

module.exports = function(app, config) {


  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';
  
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());

  // use cors
  app.use(cors());
  app.use(function(req, res, next) {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
      res.set('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token');

      next();
  });

  // Use helmet to secure Express headers
  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.disable('x-powered-by');

  // use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  // use express session and mongo-store
  app.use(session({
    secret: '1234567890QWERTY',
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    }),
    resave: true,
    saveUninitialized: true
  }));

  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  var routers = glob.sync(config.root + '/app/routes/*.js');
  routers.forEach(function (controller) {
    require(controller)(app);
  });

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

  return app;
};
