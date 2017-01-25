'use strict';

/**
 * Send User
 */
exports.user = function (req, res) {
  console.log(req.user);
  res.render('account', { user: req.user || null });
};

exports.me = function (req, res) {
  console.log(req.user);
  res.json(req.user || null);
};