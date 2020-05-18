'use strict';
module.exports = (sequelize, DataTypes) => {
  const User_reminder = sequelize.define('user_reminder', {
    weekday: DataTypes.ENUM(
      "شنبه",
      "یکشنبه",
      "دوشنبه",
      "سه شنبه",
      "چهارشنبه",
      "پنجشنبه",
      "جمعه"
    ),
    hour: DataTypes.TIME,
    active: DataTypes.BOOLEAN
  }, {
    freezeTableName: true,
    underscored: true,
  });
  User_reminder.associate = function (models) {
    User_reminder.belongsTo(models.user, {
      onDelete: "RESTRICT",
    })
  };
  return User_reminder;
};