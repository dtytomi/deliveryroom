'use strict';

var passport = require('passport'),
 FacebookStrategy = require('passport-facebook').Strategy;

function setup(User, config) {
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    profileFields: ['id', 'displayName', 'link', 'photos', 'email']
  }, 
  function(accessToken, refreshToken, profile, done) {
    
    User.findOne({
      'facebook.id': profile.id
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
          provider: 'facebook',
          username: profile.username,
          facebook: profile._json
        });
        user.facebook.accessToken = accessToken;
        user.saveAsync()
          .then(saveResult => {
              // mongoose save returns (err, obj, numaffected)
              // bluebird only expects 2 arguments so it wraps the extras in an array
              var user = saveResult[0];
              return done(null, user);
           })
          .catch(err => done(err));
      } else {
        return done(null, user);
      }
    })
  }
 ));
}

module.exports = setup;
