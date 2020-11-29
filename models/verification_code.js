'use strict';
module.exports = (sequelize, DataTypes) => {
  const verification_code = sequelize.define('verification_code', {
    phone: DataTypes.STRING,
    code: DataTypes.STRING
  }, {});
  verification_code.associate = function(models) {
    // associations can be defined here
  };
  return verification_code;
};