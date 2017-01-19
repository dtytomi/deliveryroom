'use strict';

/**
 * Send User
 */
exports.user = function (req, res) {
  res.render('account', { user: req.user || null });
};

exports.me = function (req, res) {
  res.json(req.user || null);
};