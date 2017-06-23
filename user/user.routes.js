'use strict';

var user = require('./user.controller'),
 authentication = require('../authentication/authentication.controller');

function setUserRoutes(app) {
  app.route('/me').get(authentication.isAuthenticated(), user.me);
}

module.exports = setUserRoutes;
