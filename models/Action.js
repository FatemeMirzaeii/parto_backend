'use strict';
module.exports = (sequelize, DataTypes) => {
  const Action = sequelize.define('action', {
    name: DataTypes.STRING
  }, {
    freezeTableName: true,
    underscored: true,
  });
  Action.associate = function (models) {
    Action.belongsTo(models.module, {
      onDelete: "RESTRICT"
    })
  };
  return Action;
};