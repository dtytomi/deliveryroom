'use strict';

var prayer = require('./prayer.controller'),
  passport = require('passport'),
  authentication = require('../authentication/authentication.controller');

var requireAuth = passport.authenticate('jwt', {session: false});

function setPrayerRoutes(app) {
  app.route('/prayer')
    .get(prayer.list)
    .post(requireAuth, prayer.create);

  app.route('/category')
    .get(prayer.listByCategory);

  app.route('/prayer/:prayerId')
    .get(requireAuth, prayer.read)
    .put(requireAuth, prayer.update)
    .delete(requireAuth, prayer.destroy );
  
  // Finish by binding the prayer middleware
  app.param('prayerId', prayer.prayerByID);
}

module.exports = setPrayerRoutes;