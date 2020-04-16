const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Pregnancy = sequelize.define(
  "pregnancy",
  {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Pregnancy;
