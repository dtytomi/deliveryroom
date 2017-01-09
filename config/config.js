var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'server'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://127.0.0.1:27017/server-development',
    facebook: {
      clientID: process.env.FACEBOOK_ID || 'FACEBOOK_ID',
      clientSecret: process.env.FACEBOOK_SECRET || 'FACEBOOK_SECRET',
      callbackURL: 'http://localhost:3000/auth/facebook/callback'
    },

    twitter: {
      clientID: process.env.TWITTER_CONSUMER_KEY || 'TWITTER_CONSUMER_KEY',
      clientSecret: process.env.TWITTER_CONSUMER_SECRET || 'TWITTER_CONSUMER_SECRET',
      callbackURL: 'http://localhost:3000/auth/twitter/callback'
    },

    google: {
      consumerKey: process.env.GOOGLE_CONSUMER_KEY || 'GOOGLE_CONSUMER_KEY',
      consumerSecret: process.env.GOOGLE_CONSUMER_SECRET || 'GOOGLE_CONSUMER_SECRET',
      callbackURL: 'http://localhost:3000/auth/google/callback'
    },

    instagram: {
      clientID: process.env.ClientID || 'INSTAGRAM_ID',
      clientSecret: process.env.ClientSecret || 'INSTAGRAM_SECRET',
      callbackURL: 'http://localhost:3000/auth/instagram/callback'
    }
  },

  test: {
    root: rootPath,
    app: {
      name: 'server'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://127.0.0.1:27017/server-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'server'
    },
    port: process.env.PORT || 3000,
    db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI ||'mongodb://127.0.0.1:27017/server-production',
    facebook: {
      clientID: process.env.FACEBOOK_ID || 'FACEBOOK_ID',
      clientSecret: process.env.FACEBOOK_SECRET || 'FACEBOOK_SECRET',
      callbackURL: '/auth/facebook/callback'
    },

    twitter: {
      clientID: process.env.TWITTER_CONSUMER_KEY || 'TWITTER_CONSUMER_KEY',
      clientSecret: process.env.TWITTER_CONSUMER_SECRET || 'TWITTER_CONSUMER_SECRET',
      callbackURL:  '/auth/twitter/callback'
    },

    google: {
      consumerKey: process.env.GOOGLE_CONSUMER_KEY || 'GOOGLE_CONSUMER_KEY',
      consumerSecret: process.env.GOOGLE_CONSUMER_SECRET || 'GOOGLE_CONSUMER_SECRET',
      callbackURL: '/auth/google/callback'
    },

    instagram: {
      clientID: process.env.ClientID || 'INSTAGRAM_ID',
      clientSecret: process.env.ClientSecret || 'INSTAGRAM_SECRET',
      callbackURL: '/auth/instagram/callback' 
    }
  }
};

module.exports = config[env];