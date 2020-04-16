const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Health_Tracking_Options = sequelize.define(
  "health_tracking_options",
  {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Health_Tracking_Options;
