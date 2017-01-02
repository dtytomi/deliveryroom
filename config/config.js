'use strict';

var config = {};

config.environment = process.env.NODE_ENV || 'development';

// Populate the DB withsample data
config.seedDB = false;

// Token settings
config.token = {
    secret: process.env.TOKEN_SECRET || 'wap',
    expiraion: process.env.TOKEN_EXPIRATION || 60*60*24  //24 HOURS
};

// Server settings
config.server = {
    host: '0.0.0.0',
    port: process.env.PORT || 3000
};

// Server settings
config.mongodb = {
  dbURI: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI 
};

config.facebook = {
  clientID: process.env.FACEBOOK_ID || 'FACEBOOK_ID',
  clientSecret: process.env.FACEBOOK_SECRET || 'FACEBOOK_SECRET',
  callbackURL: 'https://deliveryroom.herokuapp.com/auth/facebook/callback' ||'http://localhost:3000/auth/facebook/callback'
};

config.twitter = {
  clientID: process.env.TWITTER_CONSUMER_KEY || 'TWITTER_CONSUMER_KEY',
  clientSecret: process.env.TWITTER_CONSUMER_SECRET || 'TWITTER_CONSUMER_SECRET',
  callbackURL:  'https://deliveryroom.herokuapp.com/auth/twitter/callback'|| 'http://localhost:3000/auth/twitter/callback'
};

config.google = {
  consumerKey: process.env.GOOGLE_CONSUMER_KEY || 'GOOGLE_CONSUMER_KEY',
  consumerSecret: process.env.GOOGLE_CONSUMER_SECRET || 'GOOGLE_CONSUMER_SECRET',
  callbackURL: 'https://deliveryroom.herokuapp.com/auth/google/callback' ||'http://localhost:3000/auth/google/callback'
};

config.instagram = {
  clientID: process.env.ClientID || 'INSTAGRAM_ID',
  clientSecret: process.env.ClientSecret || 'INSTAGRAM_SECRET',
  callbackURL: 'https://deliveryroom.herokuapp.com/auth/instagram/callback' ||'http://localhost:3000/auth/instagram/callback'
};

// Export configuration object
module.exports = config;
