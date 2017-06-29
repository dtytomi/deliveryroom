'use strict';

var passport = require('passport'),
  passportJWT = require("passport-jwt"),
  ExtractJwt = passportJWT.ExtractJwt,
  JwtStrategy = passportJWT.Strategy;

function jwtLogin (User, config) {

  var jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: process.env.SECRET || config.token.secret
  };
  
  // body...
  passport.use('jwt', new JwtStrategy(jwtOptions, function (payload, done) {
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