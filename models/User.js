"use strict";
const jwt = require("jsonwebtoken");
const fs = require("fs");
const secret = fs.readFileSync("../private.key", "utf8");

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       username:
 *         type: string
 *       password:
 *         type: string
 *       active:
 *          type:boolean
 *       required:
 *         - email        
 */


module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
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
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          min: 5,
          max: 255,
          notNull: {
            msg: "لطفا ایمیل خود را وارد کنید.",
          },
          isEmail: {
            msg: "ایمیل معتبر نیست.",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          max: 1024,
          notEmpty: {
            msg: "لطفا رمز خود را وارد کنید.",
          },
        },
      },
      active: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      freezeTableName: true,
      underscored: true,
    }
  );
  User.associate = function (models) {
    User.belongsTo(models.role, {
      onDelete: "RESTRICT",
    });
    User.hasMany(models.user_log, {
      onDelete: "RESTRICT",
    });
    User.belongsToMany(models.category, {
      through: "user_favorite_category",
    });
  };
  User.prototype.generateAuthToken = () => {
    return jwt.sign({ _id: this.id }, secret);
  };
  return User;
};
