'use strict';

var config = {};

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
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  options: {
  
  }
};

config.facebook = {
  clientID: process.env.FACEBOOK_ID || '354198744940482',
  clientSecret: process.env.FACEBOOK_SECRET || '449e52b9d61f2881bcd0eae50db73892',
  callbackURL: 'https://deliveryroom.mybluemix.net/auth/facebook/callback'
};

config.twitter = {
  clientID: process.env.TWITTER_CONSUMER_KEY || 'yjTOaa6vVhNF5dOvL7xWpSwLU',
  clientSecret: process.env.TWITTER_CONSUMER_SECRET || 'eSE0DC7ut1j36uVHqn9jU4WuSphwjD9pqpTPKW1w59AojUojQm',
  callbackURL:  'https://deliveryroom.mybluemix.net/auth/twitter/callback'
};

config.google = {
  consumerKey: process.env.GOOGLE_CONSUMER_KEY || '204495323984-4iu3ct14h2tlbu353mnlan2lghfpu17l.apps.googleusercontent.com',
  consumerSecret: process.env.GOOGLE_CONSUMER_SECRET || 'RrtIynRQqg9TAY3vFQ9-oKr2',
  callbackURL: 'https://deliveryroom.mybluemix.net/auth/google/callback'
};

config.instagram = {
  clientID: process.env.ClientID || 'INSTAGRAM_ID',
  clientSecret: process.env.ClientSecret || 'INSTAGRAM_SECRET',
  callbackURL: 'https://deliveryroom.mybluemix.net/auth/instagram/callback' 
};


// Export configuration object
module.exports = config;