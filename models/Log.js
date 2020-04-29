const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Log extends Model {}

Log.init(
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
    level: {
      type: DataTypes.STRING,
      validate: {
        max: 16,
      },
    },
    message: {
      type: DataTypes.STRING,
      validate: {
        max: 512,
      },
    },
    meta: {
      type: DataTypes.STRING,
      validate: {
        max: 1024,
      },
    },
    timestamp: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
  }
);
module.exports = Log;
