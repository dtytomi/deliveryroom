'use strict';

var account = require('../controllers/account'),
  authentication = require('../controllers/authentication'), 
  express = require('express'),
  router = express.Router();

/* GET users listing. */
router.get('/user', authentication.requiresLogin, account.me );

module.exports = router;