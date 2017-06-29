'use strict';

var passport = require('passport'),
  passportJWT = require("passport-jwt"),
  LocalStrategy = require('passport-local').Strategy;

var jwt = require('jsonwebtoken'),
  ExtractJwt = passportJWT.ExtractJwt,
  JwtStrategy = passportJWT.Strategy;

function localStrategy (User, config) {
  // body...
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
    function (email, password, callback) {
      // body...
      User.findOne({
        email: email.toLowerCase()
      }, function (err, user) {
        // body...
        if (err) return callback(err);

        // no user found with that email
        if (!user) {
          return callback(null, false, { message: 'The email is not registered.'});
        }

        // make sure the password is correct 
        user.comparePassword(password, function (err, isMatch) {
          // body...
          if (err) { return callback(err); }

          // password did not match
          if (!isMatch) {
              return callback(null, false, {message: 'The password is not correct.'});
          }

          // success
          return callback(null, user)
        });

      });

    })

  );
}

function jwtLogin (User, config) {

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions = { secret: process.env.SECRET || config.token.secret};
  // body...
  passport.use(new JwtStrategy(jwtOptions, function (payload, done) {
    // body...
      User.findById(payload._id, function (err, user) {
        
        if (err) 
          return done(err, false);
        
        if (user) {
          done(null, user);
        } else{

          done(null, false);
        }

      });

    })
  );
}

module.exports = jwtLogin;
module.exports = localStrategy;