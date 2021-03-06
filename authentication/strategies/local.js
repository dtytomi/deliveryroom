'use strict';

var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

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


module.exports = localStrategy;