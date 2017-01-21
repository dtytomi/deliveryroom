'use strict';

/**
 * Module dependencies
 */
 var authourization = require('../controllers/authourization'), 
  express = require('express'),
  prayer = require('../controllers/prayer'),
  router = express.Router();

module.exports = function (app) {
  app.use('/api', router);
};

// Prayers collection routes
router.get('/prayer', prayer.list)
router.post('/prayer', authourization.requiresLogin, prayer.create);

router.get('/category', prayer.listByCategory);

// Single prayer routes
router.get('/prayer/:prayerId', authourization.requiresLogin, prayer.read)
router.put('/prayer/:prayerId', authourization.requiresLogin, prayer.update)
router.delete('/prayer/:prayerId', authourization.requiresLogin, prayer.hasAuthorization, prayer.delete);

// Finish by binding the prayer middleware
router.param('prayerId', prayer.prayerByID);