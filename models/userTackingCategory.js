'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserTrackingOption = sequelize.define('user_tracking_category', {
    date: {
      type: DataTypes.DATEONLY
    },
    value: {
      type: DataTypes.STRING
    },
  }, {
    freezeTableName: true,
    underscored: true,
  });

  UserTrackingOption.associate = function (models) {
    UserTrackingOption.belongsTo(models.user, {
      //foreignKey: "user_id",
      onDelete: "CASCADE",
    });
    UserTrackingOption.belongsTo(models.health_tracking_category, {
      foreignKey: "tracking_category_id",
      onDelete: "CASCADE",
    })
  };
  
  return UserTrackingOption;
};