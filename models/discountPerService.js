'use strict';
module.exports = (sequelize, DataTypes) => {
    const discountPerService = sequelize.define('discount_per_service', {
        status: DataTypes.ENUM('Active', 'Inactive'),
        discount_type: DataTypes.ENUM('Percent', 'Dollar', 'Rials'),
        discount_value: DataTypes.INTEGER,
        number_of_discount: DataTypes.INTEGER,
        start_time: DataTypes.DATE,
        end_time: DataTypes.DATE

    }, {
        freezeTableName: true,
        underscored: true,
    });
    discountPerService.associate = function (models) {
        discountPerService.belongsTo(models.service, {
            onDelete: "CASCADE",
            foreignKey: "service_id",
        });
    };
    return discountPerService;
};