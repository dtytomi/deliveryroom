var express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var passport = require('passport');
var authentication = require('../app/controllers/authentication'),
  cors = require('cors'),
  helmet = require('helmet'),
  methodOverride = require('method-override'),
  mongoose = require('mongoose'),
  session        = require('express-session'),
  MongoStore     = require('connect-mongo')(session),
  FacebookStrategy = require('passport-facebook').Strategy,
  GoogleStrategy = require('passport-google-oauth').OAuthStrategy,
  InstagramStrategy = require('passport-instagram').Strategy,
  TwitterStrategy = require('passport-twitter').Strategy,
  User = require('mongoose').model('User');

    



module.exports = function(app, config) {

  // Serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser(function(id, done) {
    User.findOne({
      _id: id
    }, '-salt -password', function(err, user) {
      done(err, user);
    });
  });

  // Use facebook strategy
  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL,
      passReqToCallback: true
    },

    function(req, accessToken, refreshToken, profile, done) {
      // Set the provider data and include tokens
      var providerData = profile._json;
      providerData.accessToken = accessToken;
      providerData.refreshToken = refreshToken;

      // Create the user OAuth profile 
      var providerUserProfile = {
        fisrtName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displName,
        email: profile.emails[0].value,
        username: profile.username,
        provider: 'facebook',
        providerIdentifierField: 'id',
        providerData: providerData  
      };

      // Save the user OAuth profile
      authentication.saveOAuthUserProfile(req, providerUserProfile, done);
    }
  )); 

  // Use google strategy
  passport.use( new GoogleStrategy ({
      consumerKey: config.google.consumerKey,
      consumerSecret: config.google.consumerSecret,
      callbackURL: config.google.callbackURL,
      passReqToCallback: true
    }, 

    function(req, token, tokenSecret, profile, done) {
      // Set  the provider data and include tokens
      var providerData = profile._json;
      providerData.accessToken = token;
      providerData.tokenSecret = tokenSecret;

      // Create the user OAuth profile
      var providerUserProfile = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayname,
        email: profile.emails[0].value,
        provider: 'google',
        providerIdentifierField: 'id',
        providerData: providerData
      };

      // Save the user OAuth profile
      users.saveOAuthUserProfile(req, providerUserProfile, done);
    }
  ));

  // use instagram strategy
  passport.use( new InstagramStrategy({
      clientID: config.instagram.clientID,
      clientSecret: config.instagram.clientSecret,
      callbackURL: config.instagram.callbackURL,
      passReqToCallback: true
    },

    function(req, accessToken, refreshToken, profile, done) {
      // Set the provider data and include tokens
      var providerData = profile._json;
      providerData.token = accessToken;
      providerData.tokenSecret = tokenSecret;

      // Create the user OAuth profile
      var providerUserProfile = {
        displyName: profile.full_name,
        providerIdentifierField: profile.id,
        provider: 'instagram',
        username: profile.username,
        providerData: providerData
      };

      // Save the user OAuth profile
      authentication.saveOAuthUserProfile(req, providerUserProfile, done)
    }
  ));

  // use twitter strategy
  passport.use(new TwitterStrategy({
      consumerKey: config.twitter.clientID,
      consumerSecret: config.twitter.clientSecret,
      callbackURL: config.twitter.callbackURL,
      passReqToCallback: true
    },

    function(req, token, tokenSecret, profile, done) {
      // Set the provider data and include tokens
      var providerData = profile._json;
      providerData.token = token;
      providerData.tokenSecret = tokenSecret;

      // Create the user OAuth profile
      var providerUserProfile = {
        displayName: profile.displayName,
        username: profile.username,
        provider: 'twitter',
        providerIdentifierField: 'id_str',
        providerData: providerData
      };

      // Save the user OAuth profile
      authentication.saveOAuthUserProfile(req, providerUserProfile, done)
    }
  ));

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
