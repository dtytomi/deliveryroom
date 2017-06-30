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
  passport.use('jwt', new JwtStrategy(jwtOptions, function (payload, done) {
    console.log(payload._doc._id);
    // body...
    
      User.findById(payload._doc._id, function (err, user) {

        
        
        if (err) {
          console.log(err)
          console.log('I narrowly got in here');
          return done(err, false);
        }
        if (user) {
          console.log("I got into user");
          done(null, user);
        } else{
          console.log("I got into falsehood");
          done(null, false);
        }

      });

    })
  );
}

module.exports = jwtLogin;