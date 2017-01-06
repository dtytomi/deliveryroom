

var express = require('express'),
  config = require('./config/config'),
  logger = require('mm-node-logger')(module),
  mongoose = require('./config/mongoose.js');

mongoose(function startServer () {
    
  var app = express();

  module.exports = require('./config/express')(app, config);

  app.listen(config.port, function () {
    logger.info('Express server listening on port ' + config.port);
  });

});




