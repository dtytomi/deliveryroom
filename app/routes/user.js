'use strict';

var account = require('../controllers/account'),
  authentication = require('../controllers/authentication'),
  authourization = require('../controllers/authourization'), 
  passport = require('passport'),
  express = require('express'),
  router = express.Router();

/* GET users listing. */
module.exports = function (app) {
  app.use('/', router);
};

// User Authentication
router.get('/auth/signout', authentication.signout);
 
router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));
router.get('/auth/facebook/callback', passport.authenticate('facebook'));
router.get('/authauth/facebook/callback', authentication.getOauthToken);
router.get('/auth/instagram', passport.authenticate('instagram'));
router.get('/auth/instagram/callback',  passport.authenticate('instagram'));
router.get('/auth/instagram/callback', authentication.getOauthToken);
router.get('/auth/google', passport.authenticate('google', {
  scope: [
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ]
}));
router.get('/auth/google/callback', passport.authenticate('google'));
router.get('/auth/google/callback', authentication.getOauthToken);
router.get('/auth/twitter', passport.authenticate('twitter'));
router.get('/auth/twitter/callback', passport.authenticate('twitter'));
router.get('/auth/twitter/callback', authentication.getToken);

router.get('/api/user', account.user );
router.get('/api/users/me', account.me );

// Finish by binding the user middleware
router.param('userId', authourization.userByID);