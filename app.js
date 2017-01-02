var authentication = require('./app/controllers/authentication'), 
  bodyParser = require('body-parser'), 
  cookieParser = require('cookie-parser'),
  cors = require('cors'),
  config = require('./config/config'),
  express = require('express'),
  favicon = require('serve-favicon'),
  helmet = require('helmet'),
  mongoose       = require('mongoose'),
  morgan = require('morgan'),
  passport = require('passport'),
  path = require('path'),
  session        = require('express-session'),
  MongoStore     = require('connect-mongo')(session),
  User = require('./app/models/user.js'),
  FacebookStrategy = require('passport-facebook').Strategy,
  GoogleStrategy = require('passport-google-oauth').OAuthStrategy,
  InstagramStrategy = require('passport-instagram').Strategy,
  TwitterStrategy = require('passport-twitter').Strategy;
  
  require('./config/mongoose');

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

  // use facebook strategy
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    passReqToCallback: true
  },

    function(req, accessTo, refreshToken, profile, done) {
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

var index = require('./app/routes/core'),
  auth = require('./app/routes/authentication')
  users = require('./app/routes/users');

var app = express();

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

// Express MongoDB session storage
app.use(session({
  secret: '1234567890QWERTY',
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  resave: true,
  saveUninitialized: true
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/auth', auth);
app.use('/account', users);
// app.use('/users', users);

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
