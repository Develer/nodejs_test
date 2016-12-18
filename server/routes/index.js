var csrf = require('csurf');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var express = require('express');

var models  = require('../models');

var router  = express.Router();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var csrfProtection = csrf();


router.get('/', function(req, res) {
  res.render('index', { title: 'Hello user John!', name: 'John' });
});

router.get('/register', csrfProtection, function(req, res) {
  res.end(JSON.stringify({ csrfToken: req.csrfToken() }));
});

router.post('/register', urlencodedParser, function(req, res) {
  var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  var user = {
    login: req.body.login,
    password: hash
  }
  models.users.create(user).then(function() {
    res.end(JSON.stringify({ status: 'done' }));
  });
});

router.get('/login', csrfProtection, function(req, res) {
  res.end(JSON.stringify({ csrfToken: req.csrfToken() }));
});

router.post('/login', urlencodedParser, function(req, res) {
  models.users.find({
    where: {
      login: req.body.login
    }
  }).then(function(user) {
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        req.session.user = user;
        res.setHeader('my_cookie', req.session);
        res.end(JSON.stringify({ session: req.session, session_id: req.session.id }));
      } else {
        res.end(JSON.stringify({'error': 'Login or password incorrect!'}));
      }
    } else {
        res.end(JSON.stringify({'error': 'Login or password incorrect!'}));
    }
  });
});

router.get('/logout', function(req, res) {
  req.session.destroy();
  res.end(JSON.stringify({ status: 'done' }));
});

module.exports = router;
