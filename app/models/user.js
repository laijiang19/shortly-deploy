var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var urlSchema = require('./link.js').urlSchema;

var userSchema = mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  hashed: { type: Boolean, default: false },
  links: [urlSchema]
});

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
    callback(isMatch);
  });
};

userSchema.methods.hashPassword = function(done){
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.get('password'), null, null).bind(this)
  .then(function(hash) {
    this.set('password', hash);
    done();
  });
};

userSchema.pre('save', true, function(next, done){
  next();
  if (!this.hashed){
    this.hashPassword(done);
    this.hashed = true;
  }
  else {
    done();
  }
});

var User = mongoose.model('User', userSchema);

module.exports = User;
