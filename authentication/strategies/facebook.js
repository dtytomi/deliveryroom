'use strict';

var passport = require('passport'),
 FacebookStrategy = require('passport-facebook').Strategy;

function setup(User, config) {
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    profileFields: ['id', 'displayName', 'link', 'photos', 'email'],
    passReqToCallback: true
  }, 
  function(accessToken, refreshToken, profile, done) {
    
    console.log(profile);

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
        user.save(function(err) {
          if(err) done(err);
          return done(err, user);
        })
      } else {
        return done(null, user);
      }
    })
  }
 ));
}

module.exports = setup;
