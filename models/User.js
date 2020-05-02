const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");
const jwt = require("jsonwebtoken");

var fs = require("fs");
const secret = fs.readFileSync("../private.key", "utf8");

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
      validate: {
        isInt: true,
      },
    },
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
        isHash: true,
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
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
  }
);

User.belongsToMany(sequelize.models.HealthTrackingOption, {
  through: sequelize.models.UserTrackingOption,
});

User.belongsToMany(sequelize.models.Category, {
  through: "user_favorite_category",
});

module.exports = User;
