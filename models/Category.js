const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Category extends Model {}

Category.init(
  {
    // attributes
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    // options
  }
);

Category.belongsTo(sequelize.models.Category, {
  foreignKey: "parent_category_id",
});

Category.hasMany(sequelize.models.Article, {
  onDelete: "RESTRICT",
  //onUpdate is set to "CASCADE" by default
});
module.exports = Category;
