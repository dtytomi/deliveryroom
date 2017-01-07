'use strict';

/**
 * Send User
 */
exports.me = function (req, res) {
  res.render('account', { user: req.user });
  console.log(req.user);
};