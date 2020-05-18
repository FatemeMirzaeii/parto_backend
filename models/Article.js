'use strict';
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('article', {
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
  }, {
    freezeTableName: true,
    underscored: true,
  });
  Article.associate = function (models) {
    Article.belongsTo(models.category, {
      onDelete: "RESTRICT"
    })
  };
  return Article;
};