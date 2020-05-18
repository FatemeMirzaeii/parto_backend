'use strict';
module.exports = (sequelize, DataTypes) => {
  const Health_tracking_option = sequelize.define('health_tracking_option', {
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
  Health_tracking_option.associate = function (models) {
    Health_tracking_option.belongsTo(models.health_tracking_category, {
      foreignKey:'category_id',
      onDelete: 'RESTRICT'
    })
  };
  return Health_tracking_option;
};