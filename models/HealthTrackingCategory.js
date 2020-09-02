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
    has_multiple_choice : {
      type: DataTypes.BOOLEAN,
    },
    color:{
      type: DataTypes.STRING  
    },
    icon:{
      type: DataTypes.STRING
    }

  }, {
    freezeTableName: true,
    underscored: true,
  });
  HealthTrackingCategory.associate = function (models) {
    // associations can be defined here
  };
  return HealthTrackingCategory;
};