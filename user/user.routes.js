'use strict';

var user = require('./user.controller'),
  passport = require('passport'),
  authentication = require('../authentication/authentication.controller');

var requireAuth = passport.authenticate('jwt', {session: false});

function setUserRoutes(app) {
  app.route('/me').get( requireAuth, user.me);
  app.route('/users/:id').get( requireAuth, user.findById);
  app.route('/users').get( requireAuth, user.findAll);
}

module.exports = setUserRoutes;
