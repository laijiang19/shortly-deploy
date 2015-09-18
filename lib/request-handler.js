var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var Link = require('../app/models/link');
var User = require('../app/models/user');

// can comment out when using MongoDB
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  var username = req.session.user.username;
  User.findOne({ username: username }).exec(function(err, user){
    var links = user.get('links');
    console.log(links);
    res.send(200, links);
  })
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;
  var username = req.session.user.username;

  console.log(uri);
  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  User.findOne({ username: username }).exec(function(err, user){
    var links = user.get('links');
    console.log('Current list of Links = ', links);
    for (var i = 0; i < links.length; i++) {
      if (links[i].get('url') === uri) {
        return res.send(202, links[i]);
      }
    }
    util.getUrlTitle(uri, function(err, title) {
      if (err) {
        console.log('Error reading URL heading: ', err);
        return res.send(404);
      }

      var link = new Link({
        url: uri,
        title: title,
        base_url: req.headers.origin
      });

      link.save(function(err, newLink){
        user.links.push(newLink);
        user.save(function(err, user){
          res.send(200, newLink);
        });
      })
    });
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }).exec(function(err, user){
    if (!user) {
      res.redirect('/login');
    }
    else {
      user.comparePassword(password, function(match){
        if (match) {
          util.createSession(req, res, user);
        }
        else {
          res.redirect('/login');
        }
      })
    }
  })
  //find user in DB
    //if exists
      // compare password
        // if match
          // create session
        // else
          // redirect to login
    // else
      // redirect to login

  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       res.redirect('/login');
  //     } else {
  //       user.comparePassword(password, function(match) {
  //         if (match) {
  //           util.createSession(req, res, user);
  //         } else {
  //           res.redirect('/login');
  //         }
  //       })
  //     }
  // });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}).exec(function(err, user){
    if (err) {
      throw err;
    }
    if (!user){
      var newUser = new User({
        username: username,
        password: password
      });
      newUser.save(function(err, user){
        if (err) {
          res.send(500, err);
        }
        util.createSession(req, res, newUser);
      })
    }
    else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  })

  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       var newUser = new User({
  //         username: username,
  //         password: password
  //       });
  //       newUser.save()
  //         .then(function(newUser) {
  //           util.createSession(req, res, newUser);
  //           Users.add(newUser);
  //         });
  //     } else {
  //       console.log('Account already exists');
  //       res.redirect('/signup');
  //     }
  //   })
};

exports.navToLink = function(req, res) {
  // var user = req.session.user;
  // var code = req.params[0];
  // var links = user.get('links');

  // for (var i = 0; i < links.length; i++){
  //   if (links[i].get('code') === code){
  //     return res.redirect(links[i].get('url'));
  //   }
  // }


  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
};