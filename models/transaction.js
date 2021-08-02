'use strict';
module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define('transaction', {

    amount: DataTypes.STRING,
    description: DataTypes.STRING,

  }, {
    freezeTableName: true,
    underscored: true,
  });
  transaction.associate = function (models) {
    transaction.belongsTo(models.wallet, {
      onDelete: "CASCADE",
    });
    transaction.belongsTo(models.invoice, {
      onDelete: "CASCADE",
    });
  };

  return transaction;
};