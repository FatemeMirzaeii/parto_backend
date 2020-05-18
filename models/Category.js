'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('category', {
    title: DataTypes.STRING
  }, {
    freezeTableName: true,
    underscored: true,
  });
  Category.associate = function (models) {
    Category.belongsTo(models.category, {
      foreignKey: "parent_category_id",
      onDelete: 'RESTRICT'
    })
  };
  return Category;
};