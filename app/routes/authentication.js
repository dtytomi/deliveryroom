'use strict';

var passport = require('passport'),
  express = require('express'),
  authentication = require('../controllers/authentication.js'),
  router = express.Router();

module.exports = function (app) {
  app.use('/auth', router);
};

router.get('/signout', authentication.signout);
 
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));
router.get('/facebook/callback', passport.authenticate('facebook', { successRedirect: '/account/user',
  failureRedirect: '/' }));
router.get('/instagram', passport.authenticate('instagram'));
router.get('/instagram/callback',  passport.authenticate('twitter', { successRedirect: '/account/user',
 failureRedirect: '/' }));
router.get('/google', passport.authenticate('google', {
  scope: [
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ]
}));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/account/user');
  });
router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/account/user');
  });