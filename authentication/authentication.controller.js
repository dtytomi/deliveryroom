'use strict';

var logger = require('mm-node-logger')(module),
  passport = require('passport'),
  config = require('../config/config'),
  jwt = require('jsonwebtoken'),
  compose = require('composable-middleware'),
  expressJwt = require('express-jwt');

var validateJwt = expressJwt({ secret: process.env.SECRET || config.token.secret});

function isAuthenticated(req, res, next) {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {
      User.findById(req.user._id, function (err, user) {
        if (err) return next(err);
        if (!user) return res.send(401);

        req.user = user;
        next();
     });
    });
}

function setTokenCokies(req, res, next) {
  if (!req.user) 
    return res.json(404, { message: 'Something went wrong, please try again.'});
  
  var userToken = req.query['accessToken'],
   month = 43829,
   server_token = jwt.sign({id: req.user._id}, process.env.SECRET  || config.token.secret, {expiresIn: month});

  res.cookie('token', JSON.stringify(server_token));
  res.redirect('/#/?oauth_token=' + server_token + '&userId=' + req.user._id);

}

module.exports = {
  setTokenCokies: setTokenCokies,
  isAuthenticated: isAuthenticated
};
