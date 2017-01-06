'use strict';

var account = require('../controllers/account'),
  authentication = require('../controllers/authentication'), 
  express = require('express'),
  router = express.Router();

/* GET users listing. */
module.exports = function (app) {
  app.use('/account', router);
};

router.get('/user', account.me );