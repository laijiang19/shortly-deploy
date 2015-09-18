var mongoose = require('mongoose');
var crypto = require('crypto');

var urlSchema = mongoose.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: { type: Number, default: 0 }
});

urlSchema.methods.shasum = function(){
  var shasum = crypto.createHash('sha1');
  shasum.update(this.get('url'));
  this.set('code', shasum.digest('hex').slice(0, 5));
};

urlSchema.pre('save', function(next){
  this.shasum();
  next();
});

var Link = mongoose.model('Url', urlSchema);

module.exports = Link;
module.exports.urlSchema = urlSchema;
