'use strict';

var logger = require('mm-node-logger')(module),
 config = require('./config/config'),
 express = require('./config/express'),
 mongoose = require('./config/mongoose');

mongoose(function startServer() {
  var app = express.init();

  app.listen(config.server.port, function() {
    logger.info('App is running');
  });
});
