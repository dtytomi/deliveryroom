'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
    logger = require('mm-node-logger')(module),
    Prayer = require('./models/prayer.js');  


/**
 * Create an prayer
 */
exports.create = function (req, res) {
  var prayer = new Prayer(req.body);
  prayer.user = req.user;

  prayer.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: logger.error(err.message)
      });
    } else {
      res.json(prayer);
    }
  });
};

/**
 * Show the current prayer
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var prayer = req.prayer ? req.prayer.toJSON() : {};

  // Add a custom field to the Prayer, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Prayer model.
  prayer.isCurrentUserOwner = !!(req.user && prayer.user && prayer.user._id.toString() === req.user._id.toString());

  res.json(prayer);
};

/**
 * Update an prayer
 */
exports.update = function (req, res) {
  var prayer = req.prayer;

  prayer.title = req.body.title;
  prayer.content = req.body.content;

  prayer.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: logger.error(err.message)
      });
    } else {
      res.json(prayer);
    }
  });
};

/**
 * Delete an prayer
 */
exports.delete = function (req, res) {
  var prayer = req.prayer;

  prayer.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message:logger.error(err.message)
      });
    } else {
      res.json(prayer);
    }
  });
};

/**
 * List of Prayer
 */
exports.list = function (req, res) {
  Prayer.find().sort('-created').populate('user', 'displayName').exec(function (err, prayers) {
    if (err) {
      return res.status(400).send({
        message: logger.error(err.message)
      });
    } else {
      res.json(prayers);
    }
  });
};

/**
 * List of Prayer by category
 */
exports.listByCategory = function (req, res) {
  Prayer.find({ category: req.query.category }).sort('-created').populate('user', 'displayName').exec(function (err, prayers) {
    if (err) {
      return res.status(400).send({
        message: logger.error(err.message)
      });
    } else {
      res.json(prayers);
    }
  });
};

/**
 * Prayer middleware
 */
exports.prayerByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Prayer is invalid'
    });
  }

  Prayer.findById(id).populate('user', 'displayName').exec(function (err, prayer) {
    if (err) {
      return next(err);
    } else if (!prayer) {
      return res.status(404).send({
        message: 'No prayer with that identifier has been found'
      });
    }
    req.prayer = prayer;
    next();
  });
};

/**
 * Prayer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.prayer.user.id !== req.user.id) {
        return res.send(403, 'User is not authorized');
    }
    next();
};