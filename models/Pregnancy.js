const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Pregnancy extends Model {}

Pregnancy.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
 }
);

module.exports = Pregnancy;
