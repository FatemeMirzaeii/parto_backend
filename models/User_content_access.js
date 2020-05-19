'use strict';
module.exports = (sequelize, DataTypes) => {
  const User_content_access = sequelize.define('user_content_access', {
    access_level_id: DataTypes.INTEGER
  }, {
    freezeTableName: true,
    underscored: true,
  });
  User_content_access.associate = function (models) {
    User_content_access.belongsTo(models.user, {
      onDelete: "RESTRICT",
    });
    User_content_access.belongsTo(models.article, {
      onDelete: "RESTRICT",
    });
  };
  return User_content_access;
};