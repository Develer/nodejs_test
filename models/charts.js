'use strict';
module.exports = function(sequelize, DataTypes) {
  var charts = sequelize.define('charts', {
    user_id: DataTypes.INTEGER,
    plot_exp: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return charts;
};