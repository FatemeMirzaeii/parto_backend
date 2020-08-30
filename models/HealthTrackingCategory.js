'use strict';
module.exports = (sequelize, DataTypes) => {
  const HealthTrackingCategory = sequelize.define('health_tracking_category', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "لطفا نام را وارد نمایید."
        }
      },
    },
  }, {
    freezeTableName: true,
    underscored: true,
  });
  HealthTrackingCategory.associate = function (models) {
    // associations can be defined here
  };
  return HealthTrackingCategory;
};