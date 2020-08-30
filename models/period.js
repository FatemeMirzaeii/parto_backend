'use strict';
module.exports = (sequelize, DataTypes) => {
  const period = sequelize.define('period', {
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE
  }, {});
  period.associate = function(models) {
    period.belongsTo(models.user, {
      onDelete: "RESTRICT",
    });
  };
  return period;
};