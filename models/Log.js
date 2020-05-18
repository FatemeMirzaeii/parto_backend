'use strict';
module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define('log', {
    level: DataTypes.STRING,
    message: DataTypes.STRING,
    time: DataTypes.DATE
  }, {
    freezeTableName: true,
    underscored: true,
  });
  Log.associate = function (models) {
    // associations can be defined here
  };
  return Log;
};