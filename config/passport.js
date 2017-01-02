'use strict';

var path = require('path'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    User = require('../app/models/user.js'),
    config = require('./config'),
    pathUtils = require('./utils');

module.exports = function(app) {

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

  // Initialize strategies
  pathUtils.getGlobbedPaths(path.join(__dirname, './config/strategies/**/*.js'))
    .forEach(function(strategy) {
      require(path.resolve(strategy))(User, config);
  });

};