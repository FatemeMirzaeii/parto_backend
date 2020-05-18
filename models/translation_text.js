'use strict';
module.exports = (sequelize, DataTypes) => {
  const Translation_text = sequelize.define('translation_text', {
    text: DataTypes.STRING
  }, {
    freezeTableName: true,
    underscored: true,
  });
  Translation_text.associate = function (models) {
    Translation_text.belongsTo(models.language, {
      onDelete: "RESTRICT",
    });
    Translation_text.belongsTo(models.translation_key, {
      foreignKey: "key_id",
      onDelete: "RESTRICT",
    });
  };
  return Translation_text;
};