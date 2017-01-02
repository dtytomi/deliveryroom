'use strict';

var passport = require('passport'),
    config = require('../config'),
    authentication = require('../../app/controllers/authentication.js'),
    InstagramStrategy = require('passport-instagram').Strategy;

module.exports = function() {
   passport.use( new InstagramStrategy({
    clientID: config.instagram.clientID,
    clientSecret: config.instagram.clientSecret,
    callbackURL: config.instagram.callbackURL,
    passReqToCallback: true
   },

    function(req, accessToken, refreshToken, profile, done) {
      // Set the provider data and include tokens
      var providerData = profile._json;
      providerData.token = accessToken;
      providerData.tokenSecret = tokenSecret;

      // Create the user OAuth profile
      var providerUserProfile = {
      	displyName: profile.full_name,
      	providerIdentifierField: profile.id,
      	provider: 'instagram',
      	username: profile.username,
      	providerData: providerData
      };

      // Save the user OAuth profile
      authentication.saveOAuthUserProfile(req, providerUserProfile, done)
    }
  ));
};
