'use strict';

var user = require('./user.controller');

function setUserRoutes(app) {
  app.route('/me').get( user.me);
}

module.exports = setUserRoutes;
