'use strict';
module.exports = (sequelize, DataTypes) => {
  const Translation_key = sequelize.define('translation_key', {
    key: DataTypes.STRING
  }, {
    freezeTableName: true,
    underscored: true,
  });
  Translation_key.associate = function (models) {
    // associations can be defined here
  };
  return Translation_key;
};