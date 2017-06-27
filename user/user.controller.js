'use strict';

var mongoose = require('mongoose'), 
  User = require('./user.model'),
  logger = require('mm-node-logger')(module);

/*
* Get my info
* */
function me(req, res, next) {
 console.log(req.user)
  var userId = req.user.id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) {
    if(err) return next(err);
    if(!user) return res.json(401);
    res.json(user);
  });
};

function findById (req, res) {
  // body...
  return  User.findById(req.params.id, 'name email', function (err, user) {
    // body...
    if (err) {
      logger.error(err.message);
      return res.status(400).send(err)
    } else {
      res.json(user);
    }
  });
}

function findAll (req, res) {
  // body...
  return  User.findAll(function (err, users) {
    // body...
    if (err) {
      logger.error(err.message);
      return res.status(400).send(err)
    } else {
      res.json(users);
    }
  });
}

module.exports = {
  me: me,
  findById: findById,
  findAll: findAll
}
