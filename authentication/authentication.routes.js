'use strict';

var authentication = require('./authentication.controller');
var passport = require('passport');

function setAuthenticationRoutes(app) {

  app.route('/auth/signin').post(authentication.signin);
  app.route('/auth/signout').get(authentication.signout);
  app.route('/auth/signup').post(authentication.signup);

	app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email']
  }));
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/signup',
    session: false
  }), authentication.setTokenCokies);

  app.get('/auth/google', passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }));
  app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/signup',
    session: false
  }), authentication.setTokenCokies);

  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/signup',
    session: false
  }), authentication.setTokenCokies);
}

module.exports = setAuthenticationRoutes;
