'use strict';
module.exports = (sequelize, DataTypes) => {
  const User_tracking_option = sequelize.define('user_tracking_option', {
    date: {
      type: DataTypes.DATEONLY ,
      validate: {
        isDate: true,
      },
    },
  }, {
    freezeTableName: true,
    underscored: true,
  });
  User_tracking_option.associate = function (models) {
    User_tracking_option.belongsTo(models.user, {
      onDelete: "RESTRICT",
    });
    User_tracking_option.belongsTo(models.health_tracking_option, {
      foreignKey: "tracking_option_id",
      onDelete: "RESTRICT",
    })
  };
  return User_tracking_option;
};