'use strict';

var logger = require('mm-node-logger')(module),
 mongoose = require('mongoose'),
 config = require('./config');

function createMongooseConnection(cb) {
  // create the databaseconnection
  mongoose.connect(config.mongodb.dbURI, config.mongodb.dbOptions);

  // When successfully connected
  mongoose.connection.on('connected', function () {
    logger.info('Mongoose connected to ' + config.mongodb.dbURI);
  });
  
  // If the conectionthrows an error
  mongoose.connection.on('error', function (err) {
    logger.error('Mongoose connection error: ' + err );
  });

  // When the connection is disconnected
  mongoose.connection.on('disconnected', function () {
    logger.info('Mongoose disconnected');
  });

  // when the connection is open
  mongoose.connection.once('open', function () {
    if(cb && typeof (cb) === 'function') {cb();}
  });

  // If the Node process ends, close the mongoose connection
  process.on('SIGINT', function() {
    mongoose.connection.close(function () {
      logger.info('Mongoose disconnected through app termination');
      process.exit(0);
    });
  });

}

module.exports = createMongooseConnection;
