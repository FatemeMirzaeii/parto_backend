const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Note extends Model {}

Note.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.STRING,
    },
    note_date: {
      type: DataTypes.DATE,
    },
    active: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
  }
);

module.exports = Note;
