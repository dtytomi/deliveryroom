'use strict';

var logger = require('mm-node-logger')(module),
 mongoose = require('mongoose'),
 User = require('../user/user.model'),
 Prayer = require('../prayer/prayer.model');

var testUserId = mongoose.Types.ObjectId(); 

User.find({}).remove(function(){
  User.create({
    _id: testUserId,
    provider: 'facebook',
    name: 'Test',
    email: 'test@test.com',
    password: 'test'
  }, function () {
    logger.info('Finished populating users');
  });
});

Prayer.find({}).remove(function() {
  Prayer.create({
    _id: testUserId,
    bibleRef: 'John 3 : 16',
    content: 'God helped me',
    prayer: 'God help me',
    title: 'God\'s help',
    category: 'Needs'
  }, function() {
    logger.info('Finished populating prayers');
  });
});
