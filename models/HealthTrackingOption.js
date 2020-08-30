'use strict';
module.exports = (sequelize, DataTypes) => {
  const HealthTrackingOption = sequelize.define('health_tracking_option', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
  }, {
    freezeTableName: true,
    underscored: true,
  });
  HealthTrackingOption.associate = function (models) {
    HealthTrackingOption.belongsTo(models.health_tracking_category, {
      foreignKey:'category_id',
      onDelete: 'RESTRICT'
    })
  };
  return HealthTrackingOption;
};