'use strict';

var passport = require('passport'),
 TwitterStrategy = require('passport-twitter').Strategy;

function setup(User, config) {
  passport.use(new  TwitterStrategy ({
    consumerKey: config.twitter.clientID,
    consumerSecret: config.twitter.clientSecret,
    callbackURL: config.twitter.callbackURL 
  }, 
  function(token, tokenSecret, profile, done) {
    User.findOne({
      'twitter.id_str': profile.id
    }, 
    function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        user = new User({
          name: profile.displayName,
          provider: 'twitter',
          role: 'user',
          username: profile.username,
          twitter: profile._json
        });
        user.save(function(err) {
          if(err) done(err);
          return done(err, user);
        })
      } else {
        return done(err, user);
      }
    })
  }
 ));
}

module.exports = setup;
