'use strict';

var config = require('./config'),
    logger = require('mm-node-logger')(module),
    mongoose = require('mongoose');


function createMongooseConnection (cb) {

  // create the database connection
  mongoose.connect(config.mongodb.dbURI);

  // create the database connection
  mongoose.connection.on('connected', function () {
      logger.info('Mongoose connected to ' + config.mongodb.dbURI);
  });

  // if the connection throws an error
  mongoose.connection.on('error', function (err) {
      logger.error('Mongoose connection error: ' + err);
  });

  // when the connection is disconnected
  mongoose.connection.on('disconnected', function () {
      logger.info('Mongoose disconnected');
  });

  // when the connection is open
  mongoose.connection.once('open', function () {
      if(cb && typeof(cb) === 'function') {cb();}
  });

  // For nodemon restarts
  process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
      process.kill(process.pid, 'SIGUSR2');
    });
  });

  // if the Node process ends, close the Mongoose connection
  process.on('SIGINT', function () {
    mongoose.connection.close(function () {
      logger.info('Mongoose disconnected through app termination');
      process.exit(0);
    });
  });
}

module.exports = createMongooseConnection;