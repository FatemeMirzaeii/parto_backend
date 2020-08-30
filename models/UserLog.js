'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserLog = sequelize.define('user_log', {
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
  UserLog.associate = function (models) {
    UserLog.belongsTo(models.user, {
      onDelete: "RESTRICT",
    })
  };
  return UserLog;
};