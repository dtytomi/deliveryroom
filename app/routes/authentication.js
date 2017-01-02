'use strict';

var passport = require('passport'),
  authentication = require('../controllers/authentication.js');


module.exports = function(app) {

  app.route('/auth/signout').get(authentication.signout);

  app.route('/auth/twitter').get(passport.authenticate('twitter'));
  app.route('/auth/twitter/callback').get(authentication.oauthCallback('twitter'));

  app.route('/auth/google').get(passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }));
  app.route('/auth/google/callback').get(authentication.oauthCallback('google'));

  app.route('/auth/facebook').get(passport.authenticate('facebook', {
    scope: ['email']
  }));
  app.route('/auth/facebook/callback').get(authentication.oauthCallback('facebook'));

  app.route('/auth/instagram').get(passport.authenticate('instagram'));
  app.route('/auth/instagram/callback').get(authentication.oauthCallback('instagram'));
};