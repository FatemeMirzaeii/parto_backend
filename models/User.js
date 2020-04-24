const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class User extends Model {}

User.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      max: 128,
    },
    // username: {
    //   type: DataTypes.STRING,
    //   unique: true,
    // },
    password: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      isEmail: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
  }
);

User.hasMany(sequelize.models.Note, {
  onDelete: "RESTRICT",
});

module.exports = User;
