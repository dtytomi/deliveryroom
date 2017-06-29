'use strict';

var logger = require('mm-node-logger')(module),
  passport = require('passport'),
  config = require('../config/config'),
  jwt = require('jsonwebtoken'),
  compose = require('composable-middleware'),
  expressJwt = require('express-jwt'),
  token    = require('./token.controller.js'),
  User     = require('../user/user.model.js');

var validateJwt = expressJwt({ secret: process.env.SECRET || config.token.secret});

function signin (req, res, next) {
  // body...
  passport.authenticate('local', function (err, user, info) {
    // body...
    var error = err || info;
    if (error)  return res.status(401).send(error);

    // remove sensitive data before login 
    user.passport = undefined;
    user.salt = undefined;

    token.createToken(user, function (res, err, token) {
      // body...
      if (err) {
        
        logger.error(err);
        return res.status(400).send(err);
      }

      res.status(201).json({token: token});
    }.bind(null, res));
  })(req, res, next);
}

function signout (req, res) {
  // body...
  token.expireToken(req.headers, function (err, success) {
    
    if (err) {
      logger.error(err.message);
      return res.status(401).send(err.message);
    }

    if (success) {
      delete req.user;
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }

  });
}

function signup (req, res) {
  // body...
  var email = req.body.email || '';
  var password = req.body.password || '';

  if (email == '' || password == '') {
    return res.sendStatus(400);
  }

  // Init Variables
  var user = new User (req.body);
  // add missing user field
  user.provider = 'local';
  var server_token = '';

  // Then save the user 
  user.save(function (err, user) {
    
    if (err) {
      logger.error(err.message);
      return res.status(400).send(err);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      token.createToken(user, function (res, err, token) {
        // body...
        if (err) {
          logger.error(err.message);
          return res.status(400).send(err);
        } 

        res.status(201).json({token: token});
      }.bind(null, res));

    }
  });

}

function isAuthenticated(req, res, next) {
  // return compose()
  //   // Validate jwt
  //   .use(function(req, res, next) {
  //     // allow access_token to be passed through query parameter as well
  //     if(req.query && req.query.hasOwnProperty('access_token')) {
  //       req.headers.authorization = `Bearer ${req.query.access_token}`;
  //     }
  //     validateJwt(req, res, next);
  //   })
  //   // Attach user to request
  //   .use(function(req, res, next) { 
  //     User.findById(req.user._id, function (err, user) {
  //       if (err) return next(err);
  //       if (!user) return res.send(401);

  //       req.user = user;
  //       next();
  //    });
  //   });
  
  token.verifyToken(req.headers, function(next, err, data) {
        if (err) {
            logger.error(err.message);
            return res.status(401).send(err.message);
        }

        req.user = data;

        next();
    }.bind(null, next));

}

function signToken(req, res) {
  console.log('I got into signToken');
  console.log(req.user);
  token.createToken(req.user, function (res, err, token) {
      // body...
      if (err) {
        
        logger.error(err);
        return res.status(400).send(err);
      }
      console.log('I am saved by Jesus');
      return res.status(201).json({token: token});
    }.bind(null, res));
}

function setTokenCokies(req, res, next) {
  if (!req.user) 
    return res.json(404, { message: 'Something went wrong, please try again.'});
  
  // var userToken = req.query['accessToken'],
  //  month = 43829,
  //  server_token = jwt.sign({id: req.user._id}, process.env.SECRET  || config.token.secret, {expiresIn: month});

   var server_token = signToken(req, res);

   console.log(server_token);

  res.cookie('token', JSON.stringify(server_token));
  res.redirect('/#/?oauth_token=' + server_token.token + '&userId=' + req.user._id);

}

module.exports = {
  signin: signin,
  signout: signout,
  signup: signup,
  signToken: signToken,
  setTokenCokies: setTokenCokies,
  isAuthenticated: isAuthenticated
};
