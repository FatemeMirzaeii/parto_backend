'use strict';
const jwt = require("jsonwebtoken");
const fs = require("fs");
const secret = fs.readFileSync("../private.key", "utf8");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      validate: {
        max: 128,
        notEmpty: {
          msg: "لطفا نام خود را وارد کنید.",
        },
      },
    },
    // username: {
    //   type: DataTypes.STRING,
    //   unique: true,
    // },
    password: {
      type: DataTypes.STRING,
      validate: {
        max: 1024,
        notEmpty: {
          msg: "لطفا رمز خود را وارد کنید.",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        min: 5,
        max: 255,
        notNull: true,
        isEmail: true,
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
    },
  }, {
    freezeTableName: true,
    underscored: true,
  });
  User.associate = function (models) {
    User.belongsToMany(models.category, {
      through: "user_favorite_category",
    })
  };
  User.prototype.generateAuthToken = () => {
    return jwt.sign({ _id: this.id }, secret);
  }
  return User;
};