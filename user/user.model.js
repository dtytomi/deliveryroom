'use strict';

var mongoose = require('mongoose'),
 Schema = mongoose.Schema,
 bcrypt = require('bcryptjs');

var authTypes = ['google', 'facebook', 'twitter'];
var SALT_WORK_FACTOR = 10;

var validateLocalStrategyProperty = function (property) {
  return ((this.provider !== 'local' && !this.updated) || property.lenght);
};

var UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    validate: [validateLocalStrategyProperty, 'Please fill in your name']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    validate: [validateLocalStrategyProperty, 'Please fill in your email'],
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },

  password: {
      type: String,
      required: true
  },

  salt: {
      type: String
  },

  role: {
    type: String,
    default: 'user'
  },

  provider: {
    type: String,
    required: 'Provider is required'
  },
  facebook: {},
  google: {},
  twitter: {},
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

/**
 * Virtuals
 * */

// UserSchema
//   .virtual('password')
//   .set(function(password) {
//     this._password = password;
//   })
//   .get(function() {
//     return this._password;
//   });

// Public profile informatin
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role
    };
  });

//Non sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 * */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    if (authTypes.indexOf(this.provider) !== -1) 
      return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('password')
  .validate(function(password) {
    if (authTypes.indexOf(this.provider) !== -1) 
      return true;
    return password.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user){
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
  }, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre -save hook
 * */
UserSchema
  .pre('save', function(next) {
    var user = this;
  
    //only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
      return next();
    }
    
     // password changed so we need to hash it (generate a salt)
     bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
       if (err) { return next(err); }
  
       // hash the password using our new salt
       bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) { return next(err); }
    
       // override the cleartext password with the hashed one
        user.password = hash;
        next();
       });
     });
   });

/**
 * Methods
 * */
UserSchema.methods = {

  comparePassword: function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
      cb(err, isMatch);
    });
  }
};

module.exports = mongoose.model('User', UserSchema);
