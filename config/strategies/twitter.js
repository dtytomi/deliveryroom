'use strict';

var passport = require('passport'),
    config = require('../config'),
    authentication = require('../../app/controllers/authentication.js'),
    TwitterStrategy = require('passport-twitter').Strategy;


module.exports = function() {
  passport.use(new TwitterStrategy({
    consumerKey: config.twitter.clientID,
    consumerSecret: config.twitter.clientSecret,
    callbackURL: config.twitter.callbackURL,
    passReqToCallback: true
  },

    function(req, token, tokenSecret, profile, done) {
	    // Set the provider data and include tokens
    	var providerData = profile._json;
    	providerData.token = token;
    	providerData.tokenSecret = tokenSecret;

    	// Create the user OAuth profile
    	var providerUserProfile = {
    	  displayName: profile.displayName,
    	  username: profile.username,
    	  provider: 'twitter',
    	  providerIdentifierField: 'id_str',
    	  providerData: providerData
      };

    	// Save the user OAuth profile
    	authentication.saveOAuthUserProfile(req, providerUserProfile, done)
    }
   ));
};
