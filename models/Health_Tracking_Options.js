const { DataTypes, Model } = require("sequelize");
const Sequelize = require("sequelize");
const sequelize = require("../config/database");

class Health_Tracking_Options extends Model {}

Health_Tracking_Options.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
  }
);

module.exports = Health_Tracking_Options;
