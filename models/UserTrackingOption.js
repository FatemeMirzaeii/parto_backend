const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class UserTrackingOption extends Model {}

UserTrackingOption.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    tableName: "user_tracking_option",
    underscored: true,
  }
);

module.exports = UserTrackingOption;
