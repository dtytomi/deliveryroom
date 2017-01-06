'use strict';

var home = require('../controllers/home'), 
  express = require('express'),
  router = express.Router();

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', home.index);