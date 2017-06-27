'use strict';

var user = require('./user.controller'),
 authentication = require('../authentication/authentication.controller');

function setUserRoutes(app) {
  app.route('/me').get( authentication.isAuthenticated(), user.me);
  app.route('/users/:id').get( authentication.isAuthenticated(), user.findById);
  app.route('/users').get( authentication.isAuthenticated(), user.findAll);
}

module.exports = setUserRoutes;
