'use strict';
module.exports = (sequelize, DataTypes) => {
  const User_log = sequelize.define('user_log', {
    i_p: {
      type: DataTypes.STRING,
      validate: {
        isIP: true,
      },
    },
    version: {
      type: DataTypes.STRING,
    },
    login_date: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
      },
    },
    logout_date: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
      },
    },
  }, {
    freezeTableName: true,
    underscored: true,
  });
  User_log.associate = function (models) {
    User_log.belongsTo(models.user, {
      onDelete: "RESTRICT",
    })
  };
  return User_log;
};