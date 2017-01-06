'use strict';

var articles = require('../controllers/home'), 
  express = require('express'),
  router = express.Router();

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', articles.article);