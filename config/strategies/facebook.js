'use strict';

var passport  = require('passport'),
    config = require('../config'),
    authentication = require('../../app/controllers/authentication.js'),
    FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function() {
  passport.use(new FacebookStrategy({
  	clientID: config.facebook.clientID,
  	clientSecret: config.facebook.clientSecret,
  	callbackURL: config.facebook.callbackURL,
  	passReqToCallback: true
  },

    function(req, accessTo, refreshToken, profile, done) {
      // Set the provider data and include tokens
    	var providerData = profile._json;
    	providerData.accessToken = accessToken;
    	providerData.refreshToken = refreshToken;

    	// Create the user OAuth profile 
    	var providerUserProfile = {
    	  fisrtName: profile.name.givenName,
    	  lastName: profile.name.familyName,
    	  displayName: profile.displName,
    	  email: profile.emails[0].value,
    	  username: profile.username,
    	  provider: 'facebook',
    	  providerIdentifierField: 'id',
    	  providerData: providerData	
    	};

    	// Save the user OAuth profile
    	authentication.saveOAuthUserProfile(req, providerUserProfile, done);
    }
  ));	
};

