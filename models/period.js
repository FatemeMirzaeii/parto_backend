'use strict';
module.exports = (sequelize, DataTypes) => {
  const Period = sequelize.define('Period', {
    start_date:DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    time: DataTypes.DATE
  }, {});
  Period.associate = function (models) {
    Period.belongsTo(models.user, {
      onDelete: "RESTRICT",
    })
  };
  return Period;
};