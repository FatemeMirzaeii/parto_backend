const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Article extends Model {}
Article.init(
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
        notEmpty: {
          msg: "لطفا تیتر مقاله را وارد کنید.",
        },
      },
    },
    content: {
      type: DataTypes.STRING(10000),
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
  }
);
module.exports = Article;
