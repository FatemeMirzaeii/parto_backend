'use strict';
module.exports = (sequelize, DataTypes) => {
  const Help = sequelize.define('help', {
    title: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    freezeTableName: true,
    underscored: true,
  });
  Help.associate = function(models) {
    // associations can be defined here
  };
  return Help;
};