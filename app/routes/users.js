'use strict';

var account = require('../controllers/account'),
  authentication = require('../controllers/authentication'), 
  express = require('express'),
  router = express.Router();

/* GET users listing. */
router.get('/account', authentication.requiresLogin, account.me );

module.exports = router;