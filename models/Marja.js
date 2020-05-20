'use strict';
module.exports = (sequelize, DataTypes) => {
  const Marja = sequelize.define('marja', {
    name: DataTypes.STRING
  }, {
    freezeTableName: true,
    underscored: true,
  });
  Marja.associate = function (models) {
    Marja.belongsTo(models.user, {
      onDelete: "RESTRICT",
    })
  };
  return Marja;
};