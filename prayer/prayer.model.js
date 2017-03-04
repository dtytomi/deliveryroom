'use strict';

var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

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
  bibleRef: {
    type: String,
    default: ''
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Prayer', PrayerSchema);
