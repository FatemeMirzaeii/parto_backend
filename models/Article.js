const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Article = sequelize.define(
  "article",
  {
    // attributes
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING,
      // allowNull defaults to true
    },
    content: {
      type: Sequelize.STRING,
      // allowNull defaults to true
    },
    category_id: {
      type: Sequelize.INTEGER,
      // allowNull defaults to true
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    // options
  }
);

module.exports = Article;
