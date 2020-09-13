'use strict';
module.exports = (sequelize, DataTypes) => {
  const translationText = sequelize.define('translation_text', {
    text: DataTypes.STRING
  }, {
    freezeTableName: true,
    underscored: true,
  });
  translationText.associate = function (models) {
    translationText.belongsTo(models.language, {
      foreignKey: "language_id",
      onDelete: "RESTRICT",
    });
    translationText.belongsTo(models.translation_key, {
      foreignKey: "key_id",
      onDelete: "RESTRICT",
    });
  };
  return translationText;
};