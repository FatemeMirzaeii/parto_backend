'use strict';
module.exports = (sequelize, DataTypes) => {
    const bank = sequelize.define('bank', {

        order_id: DataTypes.STRING,
        authority: DataTypes.STRING,
        gateway_link: DataTypes.STRING,
        meta_data: DataTypes.TEXT,
        gateway: DataTypes.ENUM('zp', 'ID_pay'),
        status: DataTypes.ENUM('Success', 'UnSuccess', 'Reversed', 'Waiting', 'Cancel'),

    }, {
        freezeTableName: true,
        underscored: true,
    });
    bank.associate = function (models) {
        bank.belongsTo(models.invoice, {
            onDelete: "CASCADE",
        })
    };
    return bank;
};