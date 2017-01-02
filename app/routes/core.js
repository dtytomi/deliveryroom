'use strict';

var core = require('../controllers/core'), 
  express = require('express'),
  router = express.Router();

/* GET home page. */
router.get('/', core.index);

module.exports = router;
