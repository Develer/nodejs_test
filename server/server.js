var bodyParser = require('body-parser');
var cons = require('consolidate');
var express = require('express');
// var session = require('express-session');
var session = require('cookie-session');

// var cookieParser = require('cookie-parser');
var http = require('http');
var path = require('path');
var Sequelize = require('sequelize');

var models = require('./models');
var routes = require('./routes/index');
var charts = require('./routes/charts');

var sequelize = new Sequelize({dialect: 'postgres'});

var app = express();

app.use(express.static('sources'));
// app.use(cookieParser());
app.use(bodyParser.json());
// app.use(session({
//   name: 'session',
//   secret: '1234567890qwerty',
//   duration: 30 * 60 * 1000,
//   activeDuration: 5 * 30 * 1000,
//   cookie: {
//     httpOnly: false,
//     secure: false,
//     domain: 'http://127.0.0.1:8080/'
//   }
// }));

var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
app.use(session({
  name: 'session',
  keys: ['key1', 'key2'],
  cookie: {
    secure: true,
    httpOnly: true,
    domain: 'http://127.0.0.1:8080',
    path: '/',
    expires: expiryDate
  }
}))

// Add headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
  res.setHeader('Access-Control-Allow-Methods',
                'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers',
                'X-Requested-With,content-type,cookie,set-cookie');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    models.users.find({
      where: {
        login: req.session.user.login
      }
    }).then(function(user) {
      if (user) {
        req.user = user;
        delete req.user.password;
        req.session.user = req.user;
        res.locals.user = req.user;
      }
      next();
    });
  } else {
    next();
  }
});

app.use('/', routes);
app.use('/charts', charts);

/* Server */

var server = http.createServer(app);
var port = 8081;

models.sequelize.sync().then(function() {
  server.listen(port, function() {
    var host = server.address().address;
    console.log("Example app listening at http://%s:%s", host, port);
  });
});
