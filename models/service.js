'use strict';
module.exports = (sequelize, DataTypes) => {
  const service = sequelize.define('service', {
    name:DataTypes.STRING,
    price:DataTypes.INTEGER,
    commision: DataTypes.INTEGER,
    type: DataTypes.ENUM('virtual S', 'real S', 'Physical P'),
  }, {
    freezeTableName: true,
    underscored: true,
  });
  
  return service;
};