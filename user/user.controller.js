'use strict';

var User = require('./user.model'),
 logger = require('mm-node-logger')(module);

/*
* Get my info
* */
function me(req, res, next) {
 
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) {
    if(err) return next(err);
    if(!user) return res.json(401);
    res.json(user);
  });
};

module.exports = {
  me: me
}
