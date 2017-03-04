'use strict';

var prayer = require('./prayer.controller'),
 authentication = require('../authentication/authentication.controller');

function setPrayerRoutes(app) {
  app.route('/prayer')
    .get(prayer.list)
    .post(authentication.isAuthenticated, prayer.create);

  app.route('/category')
    .get(prayer.listByCategory);

  app.route('/prayer/:prayerId')
    .get(authentication.isAuthenticated, prayer.read)
    .put(authentication.isAuthenticated, prayer.update)
    .delete(authentication.isAuthenticated, prayer.hasAuthorization, prayer.destroy );
  
  // Finish by binding the prayer middleware
  app.param('prayerId', prayer.prayerByID);
}

module.exports = setPrayerRoutes;