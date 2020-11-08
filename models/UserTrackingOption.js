'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserTrackingOption = sequelize.define('user_tracking_option', {
    date: {
      type: DataTypes.DATEONLY 
    },
  }, {
    freezeTableName: true,
    underscored: true,
  });
  UserTrackingOption.associate = function (models) {
    UserTrackingOption.belongsTo(models.user, {
      //foreignKey: "user_id",
      onDelete: "RESTRICT",
    });
    UserTrackingOption.belongsTo(models.health_tracking_option, {
      foreignKey: "tracking_option_id",
      onDelete: "RESTRICT",
    })
  };
  return UserTrackingOption;
};