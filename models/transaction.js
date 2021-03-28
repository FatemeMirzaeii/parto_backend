'use strict';
module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define('transaction', {
    
    amount:DataTypes.INTEGER,
    description:DataTypes.STRING,
    card_pan:DataTypes.STRING,
    card_hash:DataTypes.STRING,
    transaction_number:DataTypes.INTEGER,
    transaction_type:{
        type: DataTypes.ENUM('Debtor', 'Creditor')
    },

  }, {
    freezeTableName: true,
    underscored: true,
  });
  transaction.associate = function (models) {
    transaction.belongsTo(models.user, {
      onDelete: "CASCADE",
    })
  };
  return transaction;
};