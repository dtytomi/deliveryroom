var path = require('path'),
 passport = require('passport'),
 User = require('../user/user.model'),
 config = require('../config/config'),
 pathUtils = require('../utils/path-utils');

module.exports = function(app) {
  // Serialize sessions
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser(function (id, done) {
    User.findOne({
      _id: id
    }, '-salt -password', function (err, user) {
      done(err, user);
    });
  });

  //Initialize strategies
  pathUtils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js'))
    .forEach(function(strategy) {
      require(path.resolve(strategy))(User, config)
    });

  // Add passport's middleware
  app.use(passport.initialize());
  app.use(passport.session());
  
};
