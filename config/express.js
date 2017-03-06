'use strict';

var express = require('express');
var glob = require('glob');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var passport = require('passport');
var morgan = require('morgan');
var path = require('path');
var cors = require('cors'),
 helmet = require('helmet'),
 methodOverride = require('method-override'),
 mongoose = require('mongoose'),
 session        = require('express-session'),
 MongoStore     = require('connect-mongo')(session);

var pathUtils = require('../utils/path-utils'),
 config = require('./config');

function initMiddleware(app) {
  // Showing stack errors
  app.set('showStackError', true);

  // Enable jsonp
  app.enable('jsonp callback');
  if (config.environment === 'development') {
    // Enable logger (morgan);
    app.use(morgan('dev'));

    // Disable views cache
    app.set('view cache', false);
  } else if (config.environment === 'production') {
    app.locals.cache = 'memory';
  }

  // use express session and mongo-store
  app.use(session({
    secret: '1234567890QWERTY',
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    }),
    resave: true,
    saveUninitialized: true
  }));
  
  // Request body parsing middleware sould be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());
  app.use(methodOverride());

}

function initHelmetHeaders(app) {
  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.disable('x-power-by');
}

function initCrossDomain(app) {
  app.use(cors());
  app.use(function(req, res, next){
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.set('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token');

    next();
  });
}

function initConfig(app) {
  pathUtils.getGlobbedPaths(path.join(__dirname, '../**/*.config.js'))
    .forEach(function(routePath){
      require(path.resolve(routePath))(app);
    }); 
}

function initRoutes(app) {
  pathUtils.getGlobbedPaths(path.join(__dirname, '../**/*.routes.js'))
  .forEach(function (routePath) {
      require(path.resolve(routePath))(app);
   });
}

function initDB() {
  if(config.seedDB) {
    require('./seed');
  }
}

function init() {
  var app = express();

  initMiddleware(app);
  initHelmetHeaders(app);
  initCrossDomain(app);
  initConfig(app);
  initRoutes(app);
  initDB();

  return app;
}
             
module.exports.init = init;
