'use strict';
module.exports = (sequelize, DataTypes) => {
  const User_reminder = sequelize.define('user_reminder', {
    title: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.ENUM(
        "روزانه",
        "هفتگی",
        "ماهانه",
      )
    },
    hour: {
      type: DataTypes.TIME
    },
    weekday: {
      type: DataTypes.ENUM(
        "شنبه",
        "یکشنبه",
        "دوشنبه",
        "سه شنبه",
        "چهارشنبه",
        "پنجشنبه",
        "جمعه"
      )
    },
    day_in_month: {
      type: DataTypes.INTEGER
    },
    active: {
      type: DataTypes.BOOLEAN
    },
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