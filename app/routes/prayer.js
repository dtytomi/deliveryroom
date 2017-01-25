var authentication = require('../controllers/authentication'),
  express = require('express'),
  prayers = require('../controllers/prayer'),
  router = express.Router();

module.exports = function (app) {
  app.use('/', router);
};

// Prayers collection routes
  router.get('/prayers', prayers.list);
  router.post('/prayers', authentication.requiresLogin, prayers.create);

  router.get('/prayers/:category', prayers.listByCategory);

  // Single prayer routes
  router.get('/prayers/:prayerId', prayers.read)
  router.put('/prayers/:prayerId', authentication.requiresLogin, prayers.update)
  router.delete('/prayers/:prayerId', authentication.requiresLogin, prayers.hasAuthorization, prayers.delete);

  // Finish by binding the prayer middleware
  router.param('prayerId', prayers.prayerByID);