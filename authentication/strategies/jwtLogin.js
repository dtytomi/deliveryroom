'use strict';

var passport = require('passport'),
  passportJWT = require("passport-jwt"),
  ExtractJwt = passportJWT.ExtractJwt,
  JwtStrategy = passportJWT.Strategy,
  _ = require("lodash");

function jwtLogin (User, config) {

  var jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: process.env.SECRET || config.token.secret
  };
  
  // body...
  passport.use('jwt', new JwtStrategy(jwtOptions, function ( payload, done) {
    // body...
      console.log(payload);

      User.findById(payload._doc._id, function (err, user) {

        
        
        if (err) {
          console.error(err)
          return done(err, false);
        }
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