'use strict';

var passport = require('passport'),
    config = require('../config'),
    authentication = require('../../app/controllers/authentication.js'),
    GoogleStrategy = require('passport-google-oauth').OAuthStrategy;

module.exports = function() {
  // Use google strategy
  passport.use( new GoogleStrategy ({
    consumerKey: config.google.consumerKey,
    consumerSecret: config.google.consumerSecret,
    callbackURL: config.google.callbackURL,
    passReqToCallback: true
  }, 

    function(req, token, tokenSecret, profile, done) {
      // Set  the provider data and include tokens
      var providerData = profile._json;
      providerData.accessToken = token;
      providerData.tokenSecret = tokenSecret;

      // Create the user OAuth profile
      var providerUserProfile = {
      	firstName: profile.name.givenName,
      	lastName: profile.name.familyName,
      	displayName: profile.displayname,
      	email: profile.emails[0].value,
      	provider: 'google',
      	providerIdentifierField: 'id',
      	providerData: providerData
      };

      // Save the user OAuth profile
      users.saveOAuthUserProfile(req, providerUserProfile, done);
    }
  ));
};