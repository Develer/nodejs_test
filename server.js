var bodyParser = require('body-parser');
var cons = require('consolidate');
var express = require('express');
var session = require('express-session')
var http = require('http');
var path = require('path');
var Sequelize = require('sequelize');

var models = require('./models');
var routes = require('./routes/index');
var charts = require('./routes/charts');

var sequelize = new Sequelize({dialect: 'postgres'});

var app = express();

app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(express.static('sources'));
app.use(bodyParser.json());
app.use(session({secret: '1234567890qwerty'}));

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
