'use strict';

var mongoose = require('mongoose'),
 Prayer = require('./prayer.model'),
 logger = require('mm-node-logger')(module);

/**
** Create an prayer
**/
function create(req, res) {
  var prayer = new Prayer(req.body);
  prayer.user = req.user;

  prayer.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: logger.error(err)
      });
    } else {
      res.json(prayer);
    }
  });
};

/**
** Show the current prayer
**/
function read(req, res) {
  // convert mongoose document to JSON
  var prayer = req.prayer ? req.prayer.toJSON() : {};

  // Add a custom field to the Prayer, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Prayer model.
  prayer.isCurrentUserOwner = !!(req.user && prayer.user && prayer.user._id.toString() === req.user._id.toString());

  res.json(prayer);
};

/**
** Update a prayer
**/
function update(req, res) {
  var prayer = req.prayer;

  prayer.title = req.body.title;
  prayer.content = req.body.content;

  prayer.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: logger.error(err)
      });
    } else { 
      res.json(prayer);
    }
  });
};

/**
** Delete a prayer
**/
function destroy(req, res) {
  var prayer = req.prayer;

  prayer.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: logger.error(err)
      });
    } else {
      res.json(prayer);
    }
  });
};

/**
** List of Prayer
**/
function list(req, res) {
  Prayer.find().sort('-created').populate('user', 'name provider facebook twitter').exec(function (err, prayers) {
    if (err) {
      return res.status(400).send({
        message: logger.error(err)
      });
    } else {
      logger.info('Ayo');
      res.json(prayers);
    }
  });
};

/**
** List of Prayer by category
**/
function listByCategory(req, res) {
  Prayer.find({ category: req.params.category }).sort('-created').populate('user', 'name facebook twitter').exec(function (err, prayers) {
    if (err) {
      return res.status(400).send({
        message: logger.error(err)
      });
    } else {
      logger.info('Category');
      res.json(prayers);
    }
  });
};


/**
** Prayer middleware
**/
function prayerByID(req, res, next, id) {

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

module.exports = {
  create: create,
  read: read,
  destroy: destroy,
  update: update,
  list: list,
  listByCategory: listByCategory,
  prayerByID: prayerByID
};
