'use strict';
module.exports = (sequelize, DataTypes) => {
  const service = sequelize.define('service', {
    service:DataTypes.STRING,
 }, {
    freezeTableName: true,
    underscored: true,
  });
  
  return service;
};