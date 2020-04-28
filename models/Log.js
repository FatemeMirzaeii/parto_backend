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
    type: {
      type: DataTypes.ENUM("ERROR", "INFO", "WARNING"),
    },
    content: {
      type: DataTypes.STRING,
    },
    date: {
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
