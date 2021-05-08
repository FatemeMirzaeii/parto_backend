'use strict';
module.exports = (sequelize, DataTypes) => {
    const invoice = sequelize.define('invoice', {
        method: DataTypes.ENUM('gateway', 'wallet'),
        status: DataTypes.ENUM('Success', 'UnSuccess', 'wating to pay'),

    }, {
        freezeTableName: true,
        underscored: true,
    });
    invoice.associate = function (models) {
        invoice.belongsTo(models.user, {
            foreignKey: "user_id",
            onDelete: "CASCADE",
        });
        invoice.belongsTo(models.service, {
            onDelete: "CASCADE",
        });
    };
    return invoice;
};