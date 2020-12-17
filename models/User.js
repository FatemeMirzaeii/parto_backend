"use strict";
const jwt = require("jsonwebtoken");
const fs = require("fs");
const secret = fs.readFileSync("../private.key", "utf8");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        // validate: {
        //   max: 128,
        //   notEmpty: {
        //     msg: "لطفا نام خود را وارد کنید.",
        //   },
        // },
      },
      phone: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          notEmpty: {
            msg: "لطفا شماره تلفن خود را وارد کنید.",
          },
        },
      },
      // username: {
      //   type: DataTypes.STRING,
      //   unique: true,
      // },
      email: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: true,

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
      version_type: {
        type: DataTypes.ENUM('Main', 'Partner', 'Teenager'),
      },
      active: {
        type: DataTypes.BOOLEAN,
      },
      uuid: {
        type: DataTypes.UUID,
      },
      imei: {
        type: DataTypes.STRING,
      }
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
    User.belongsTo(models.user, {
      foreignKey: "partner_id",
      onDelete: "RESTRICT",
    });
    User.hasMany(models.user_log, {
      onDelete: "RESTRICT",
    });
    User.belongsToMany(models.category, {
      through: "user_favorite_category",
    });
  };

  User.prototype.generateAuthToken = function () {
    return jwt.sign({ _id: this.id, _phone: this.phone }, secret);
  };
  return User;
};
