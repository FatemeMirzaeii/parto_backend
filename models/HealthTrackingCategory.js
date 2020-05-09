const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class HealthTrackingCategory extends Model { }

HealthTrackingCategory.init(
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
        notEmpty: {
          msg: "لطفا نام را وارد نمایید."
        }
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    tableName: "health_tracking_category",
    underscored: true,
  }
);

module.exports = HealthTrackingCategory;
