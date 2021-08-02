'use strict';
module.exports = (sequelize, DataTypes) => {
  const wallet = sequelize.define('wallet', {
    remaining:DataTypes.INTEGER,
    
  }, {
    freezeTableName: true,
    underscored: true,
  });
  wallet.associate = function (models) {
    wallet.belongsTo(models.user, {
      onDelete: "CASCADE",
    })
  };
  return wallet;
};