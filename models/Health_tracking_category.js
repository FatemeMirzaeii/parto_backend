'use strict';
module.exports = (sequelize, DataTypes) => {
  const Health_tracking_category = sequelize.define('health_tracking_category', {
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
  Health_tracking_category.associate = function (models) {
    // associations can be defined here
  };
  return Health_tracking_category;
};