'use strict';

/**
 * Send User
 */
exports.me = function (req, res) {
  console.log(req.user);
  res.render('account', { user: req.user });
};