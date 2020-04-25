const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");
const jwt = require("jsonwebtoken");
var fs = require('fs');
const secret = fs.readFileSync("./private.key", "utf8");

class User extends Model {
  generateAuthToken() {
    return jwt.sign({ _id: this.id }, secret);
  }
}

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
