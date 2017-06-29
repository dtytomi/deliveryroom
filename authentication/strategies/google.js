'use strict';

var passport = require('passport'),
  GoogleStrategy = require('passport-google-oauth').OAuthStrategy;

function setup(User, config) {
  passport.use(new GoogleStrategy({
    consumerKey: config.google.consumerKey,
    consumerSecret: config.google.consumerSecret,
    callbackURL: config.facebook.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({
      'google.id': profile.id
    },
    function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          role: 'user',
          provider: 'google',
          username: profile.username,
          google: profile._json
        });
        user.saveAsync()
          .then(function (result) {
              // mongoose save returns (err, obj, numaffected)
              // bluebird only expects 2 arguments so it wraps the extras in an array
              var user = result[0];
              return done(null, user);
           })
          .catch(err => done(err));
      } else {
        return done(err, user);
      }
    })
  }
  ));
};

module.exports = setup;
