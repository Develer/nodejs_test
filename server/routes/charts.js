var models  = require('../models');
var express = require('express');
var router  = express.Router();
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

// create chart
router.post('/create', urlencodedParser, function (req, res) {
  var chart = {
    user_id: parseInt(req.body.user_id),
    plot_exp: req.body.plot_exp
  };
  models.charts.create(chart).then(function(resp) {
    var data = {
      plot_id: resp.dataValues.id,
      user_id: resp.dataValues.user_id,
      plot: resp.dataValues.plot_exp
    };
    res.end(JSON.stringify(data));
  });
});

// update chart
router.post('/update', urlencodedParser, function (req, res) {
  models.charts.find({
    where: {
      id: parseInt(req.body.plot_id),
      user_id: parseInt(req.body.user_id)
    }
  }).then(function(chart) {
    if (chart) {
      chart.updateAttributes({
        plot_exp: req.body.plot_exp
      }).then(function(resp) {
        var data = {
          plot_id: resp.dataValues.id,
          user_id: resp.dataValues.user_id,
          plot: resp.dataValues.plot_exp
        };
        res.end(JSON.stringify(data));
      });
    }
  });
});

// chart list
router.post('/list', urlencodedParser, function (req, res) {
  models.charts.findAll({
    where: {
      user_id: parseInt(req.body.id)
    }
  }).then(function(plot_exp) {
    res.end(JSON.stringify({"plots": plot_exp}));
  });
});

// delete chart
router.post('/delete', urlencodedParser, function(req, res) {
  models.charts.destroy({
    where: {
      id: parseInt(req.body.plot_id),
      user_id: parseInt(req.body.user_id)
    }
  }).then(function() {
    res.end(JSON.stringify({plot_id: parseInt(req.body.plot_id)}));
  });
});

function requireLogin(req, res, next) {
  if (!req.user) {
    res.end(JSON.stringify({access: true}));
  } else {
    next();
  }
}

module.exports = router;
