'use strict';

/**
 * Send User
 */
exports.users = function (req, res) {
  res.render('account', { user: req.user || null });
};

exports.me = function (req, res) {
  res.render('account', { user: req.user || null });
};