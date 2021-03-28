'use strict';
module.exports = (sequelize, DataTypes) => {
  const credit = sequelize.define('credit', {
    remaining:DataTypes.INTEGER,
    
  }, {
    freezeTableName: true,
    underscored: true,
  });
  credit.associate = function (models) {
    credit.belongsTo(models.user, {
      onDelete: "CASCADE",
    })
  };
  return credit;
};