'use strict';
module.exports = (sequelize, DataTypes) => {
  const Language = sequelize.define('language', {
    name: DataTypes.STRING
  }, {
    freezeTableName: true,
    underscored: true,
  });
  Language.associate = function (models) {
    // associations can be defined here
  };
  return Language;
};