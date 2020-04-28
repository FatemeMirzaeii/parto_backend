const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class UserReminder extends Model {}

UserReminder.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      validate: {
        isInt: true,
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
      onDelete: "RESTRICT",
    },
    Weekday: {
      type: DataTypes.ENUM(
        "شنبه",
        "یکشنبه",
        "دوشنبه",
        "سه شنبه",
        "چهارشنبه",
        "پنجشنبه",
        "جمعه"
      ),
    },
    Hour: {
      type: DataTypes.TIME,
    },
    type: {
      type: DataTypes.ENUM,
    },
    active: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    tableName: "user_reminder",
    freezeTableName: true,
    underscored: true,
  }
);

module.exports = UserReminder;
