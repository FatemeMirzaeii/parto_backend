'use strict';
module.exports = (sequelize, DataTypes) => {
  const ledger = sequelize.define('ledger', {
    description:DataTypes.STRING,
    transaction_type:{
        type: DataTypes.ENUM('Debtor', 'Creditor')
    },

  }, {
    freezeTableName: true,
    underscored: true,
  });
  ledger.associate = function (models) {
    ledger.belongsTo(models.service, {
      onDelete: "CASCADE",
    })
  };
  ledger.associate = function (models) {
    ledger.belongsTo(models.user, {
      onDelete: "CASCADE",
    })
  };
  return ledger;
};