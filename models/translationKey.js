'use strict';
module.exports = (sequelize, DataTypes) => {
  const translationKey = sequelize.define('translation_key', {
    key: DataTypes.STRING
  }, {
    freezeTableName: true,
    underscored: true,
  });
  translationKey.associate = function (models) {
    // associations can be defined here
  };
  return translationKey;
};