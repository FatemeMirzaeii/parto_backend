const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "user",
  {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    // username: {
    //   type: Sequelize.STRING,
    //   unique: true,
    // },
    password: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    active: {
      type: Sequelize.BOOLEAN,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = User;
