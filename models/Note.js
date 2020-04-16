const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Note = sequelize.define(
  "note",
  {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING,
    },
    content: {
      type: Sequelize.STRING,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    note_date: {
      type: Sequelize.DATE,
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

module.exports = Note;
