'use strict';
module.exports = (sequelize, DataTypes) => {
  const Module = sequelize.define('module', {
    name: DataTypes.STRING
  }, {
    freezeTableName: true,
    underscored: true,
  });
  Module.associate = function(models) {
    // associations can be defined here
  };
  return Module;
};