'use strict';

var account = require('../controllers/account'),
  authentication = require('../controllers/authentication'),
  authourization = require('../controllers/authourization'), 
  passport = require('passport'),
  express = require('express'),
  router = express.Router();

/* GET users listing. */
module.exports = function (app) {
  app.use('/auth', router);
  app.use('/account', router);
};

// User Authentication
router.get('/signout', authentication.signout);
 
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));
router.get('/facebook/callback', authentication.oauthCallback('facebook'));
router.get('/facebook/callback', authentication.getOauthToken);
router.get('/instagram', passport.authenticate('instagram'));
router.get('/instagram/callback',  authentication.oauthCallback('instagram'));
router.get('/instagram/callback', authentication.getOauthToken);
router.get('/google', passport.authenticate('google', {
  scope: [
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ]
}));
router.get('/google/callback', authentication.oauthCallback('google'));
router.get('/google/callback', authentication.getOauthToken);
router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback', authentication.oauthCallback('twitter'));
router.get('/twitter/callback', authentication.getToken);

router.get('/user', account.user );
router.get('/users/me', account.me );

// Finish by binding the user middleware
router.param('userId', authourization.userByID);