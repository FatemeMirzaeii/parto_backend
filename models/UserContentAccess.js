'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserContentAccess = sequelize.define('user_content_access', {
    access_level_id: DataTypes.INTEGER
  }, {
    freezeTableName: true,
    underscored: true,
  });
  UserContentAccess.associate = function (models) {
    UserContentAccess.belongsTo(models.user, {
      onDelete: "RESTRICT",
    });
    UserContentAccess.belongsTo(models.article, {
      onDelete: "RESTRICT",
    });
  };
  return UserContentAccess;
};