'use strict';

var  authentication = require('../app/controllers/authentication'), 
  config = require('./config'),
  passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  GoogleStrategy = require('passport-google-oauth').OAuthStrategy,
  InstagramStrategy = require('passport-instagram').Strategy,
  TwitterStrategy = require('passport-twitter').Strategy,
  User = require('mongoose').model('User'); 


module.exports = function () {
  // Serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser(function(id, done) {
    User.findOne({
      _id: id
    }, '-salt -password', function(err, user) {
      done(err, user);
    });
  });

  // Use facebook strategy
  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL,
      passReqToCallback: true,
      profileFields: ['id', 'emails', 'name'] 
    },

    function(req, accessToken, refreshToken, profile, done) {
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

  // use instagram strategy
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

  // use twitter strategy
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

}