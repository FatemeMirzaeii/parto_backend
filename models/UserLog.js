const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class UserLog extends Model {}

UserLog.init(
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
      onDelete:"RESTRICT"
    },
    IP: {
      type: DataTypes.STRING,
      validate: {
        isIP: true,
      },
    },
    version: {
      type: DataTypes.STRING,
    },
    login_date: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
      },
    },
    logout_date: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
      },
    },
  },
  {
    sequelize,
    tableName: "user_log",
    freezeTableName: true,
    underscored: true,
  }
);

module.exports = UserLog;
