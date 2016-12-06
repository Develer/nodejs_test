var models  = require('../models');
var express = require('express');
var router  = express.Router();
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

// create chart
router.post('/create', urlencodedParser, requireLogin, function (req, res) {
  var chart = {
    user_id: parseInt(req.user.id),
    plot_exp: req.body.plot_exp
  };
  models.charts.create(chart).then(function() {
    res.end(JSON.stringify(chart));
  });
});

// update chart
router.post('/:id/update', urlencodedParser, requireLogin, function (req, res) {
  models.charts.find({
    where: {
      id: parseInt(req.params.id),
      user_id: parseInt(req.user.id)
    }
  }).then(function(chart) {
    if (chart) {
      chart.updateAttributes({
        plot_exp: req.body.plot_exp
      }).then(function() {
        res.end(JSON.stringify({"status": "OK!"}));
      });
    }
  });
});

// chart list
router.post('/list', urlencodedParser, requireLogin, function (req, res) {
  models.charts.findAll({
    where: {
      user_id: parseInt(req.user.id)
    }
  }).then(function(plot_exp) {
    res.end(JSON.stringify({"plots": plot_exp}));
  });
});

// delete chart
router.post('/:id/delete', urlencodedParser, requireLogin, function(req, res) {
  models.charts.destroy({
    where: {
      id: parseInt(req.params.id),
      user_id: parseInt(req.user.id)
    }
  }).then(function() {
    res.end(JSON.stringify({"status": "OK!"}));
  });
});

function requireLogin(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
}

module.exports = router;
