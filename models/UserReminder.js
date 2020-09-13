'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserReminder = sequelize.define('user_reminder', {
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
  UserReminder.associate = function (models) {
    UserReminder.belongsTo(models.user, {
      onDelete: "RESTRICT",
    })
  };
  return UserReminder;
};