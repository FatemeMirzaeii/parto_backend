const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class HealthTrackingOption extends Model {}

HealthTrackingOption.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "health_tracking_category",
        key: "id",
      },
      onDelete: "RESTRICT",
    },
  },
  {
    sequelize,
    freezeTableName: true,
    tableName: "health_tracking_option",
    underscored: true,
  }
);

module.exports = HealthTrackingOption;
