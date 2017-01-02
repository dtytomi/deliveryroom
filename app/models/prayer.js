'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

/**
 * Prayer Schema
 */
var PrayerSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  category: {
    type: String,
    default: '',
    trim: true,
    required: 'You have to choose Category'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});


mongoose.model('Prayer', PrayerSchema);
