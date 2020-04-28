const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Message extends Model {}

Message.init(
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
    title: {
      type: DataTypes.STRING,
      validate: {
        max: 1024,
      },
    },
    content: {
      type: DataTypes.STRING,
    },
    parent_message_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "message",
        key: "id",
      },
      onDelete:"RESTRICT"
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
  }
);

module.exports = Message;
