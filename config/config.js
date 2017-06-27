'use strict';

var config = {};
var cfenv = require('cfenv'),
  appEnv = cfenv.getAppEnv();

var getCred = function (serviceName, credProp) {
  return appEnv.getService(serviceName) ?
    appEnv.getService(serviceName).credentials[credProp] : undefined;
};

config.environment = process.env.NODE_ENV || 'development';

// Populate the DB with sample data
config.seedDB = true;

//Token Settings
config.token = {
  secret: process.env.TOKEN_SECRET || 'deliveryroom',
  expiration: process.env.TOKEN_EXPIRATION || 60 * 60 * 24 //24 Hours
};

//Server Settings
config.server = {
  port: process.env.PORT || 3000,
  host: '0.0.0.0'
};

config.mongodb = {
  dbURI: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/wap',
  dbOptions: {"user":"", "pass": ""}
};

// Redis settings
config.redis = {
  host: getCred('Redis Cloud-a2', 'hostname') || '127.0.0.1',
  port: getCred('Redis Cloud-a2', 'port') || 6379,
  options: {
    "password": getCred('Redis Cloud-a2', 'password')
  }
};

config.facebook = {
  clientID: process.env.FACEBOOK_ID || 'FACEBOOK_ID',
  clientSecret: process.env.FACEBOOK_SECRET || 'FACEBOOK_SECRET',
  callbackURL: 'https://deliveryroom.mybluemix.net/auth/facebook/callback'
};

config.twitter = {
  clientID: process.env.TWITTER_CONSUMER_KEY || 'TWITTER_CONSUMER_KEY',
  clientSecret: process.env.TWITTER_CONSUMER_SECRET || 'TWITTER_CONSUMER_SECRET',
  callbackURL:  'https://deliveryroom.mybluemix.net/auth/twitter/callback'
};

config.google = {
  consumerKey: process.env.GOOGLE_CONSUMER_KEY || 'GOOGLE_CONSUMER_KEY',
  consumerSecret: process.env.GOOGLE_CONSUMER_SECRET || 'GOOGLE_CONSUMER_SECRET',
  callbackURL: 'https://deliveryroom.mybluemix.net/auth/google/callback'
};

config.instagram = {
  clientID: process.env.ClientID || 'INSTAGRAM_ID',
  clientSecret: process.env.ClientSecret || 'INSTAGRAM_SECRET',
  callbackURL: 'https://deliveryroom.mybluemix.net/auth/instagram/callback' 
};


// Export configuration object
module.exports = config;