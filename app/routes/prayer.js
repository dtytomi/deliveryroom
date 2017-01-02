var prayers         = require('../controllers/prayer'),
    authentication = require('../controllers/authentication');

module.exports = function (app) {
  // Prayers collection routes
  app.route('/prayers')
    .get(prayers.list)
    .post(authentication.requiresLogin, prayers.create);

  app.route('/prayers/:category')
    .get(prayers.listByCategory);

  // Single prayer routes
  app.route('/prayers/:prayerId')
    .get(prayers.read)
    .put(authentication.requiresLogin, prayers.update)
    .delete(authentication.requiresLogin, prayers.hasAuthorization, prayers.delete);

  // Finish by binding the prayer middleware
  app.param('prayerId', prayers.prayerByID);
};
