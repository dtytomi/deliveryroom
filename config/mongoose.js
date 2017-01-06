'use strict';

var glob = require('glob'), 
  logger = require('mm-node-logger')(module),
  mongoose = require('mongoose'),
  config = require('./config');

function createMongooseConnection (cb) {

  var models = glob.sync(config.root + '/app/models/*.js');
  models.forEach(function (model) {
    require(model);
  });


  // create the database connection
  mongoose.connect(config.db);

  // create the database connection
  mongoose.connection.on('connected', function () {
       logger.info('Mongoose connected to ' + config.db);
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

  // if the Node process ends, close the Mongoose connection
  process.on('SIGINT', function () {
    mongoose.connection.close(function () {
      logger.info('Mongoose disconnected through app termination');
      process.exit(0);
    });
  });
}

module.exports = createMongooseConnection;

