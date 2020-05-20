'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('role', {
    name: DataTypes.STRING
  }, {
    freezeTableName: true,
    underscored: true,
  });
  Role.associate = function(models) {
    // associations can be defined here
  };
  return Role;
};