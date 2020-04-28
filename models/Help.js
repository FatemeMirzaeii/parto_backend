const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Help extends Model {}

Help.init(
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
    title: {
      type: DataTypes.STRING,
      validate: {
        max: 1024,
      },
    },
    content: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
  }
);
module.exports = Help;
