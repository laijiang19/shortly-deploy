var mongoose = require('mongoose');
var path = require('path');

var uristring =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/shortlydb';

mongoose.connect(uristring);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('connected', function (callback) {
  console.log('Connected to ', uristring);
});

module.exports = db;
