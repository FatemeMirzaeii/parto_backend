'use strict';
module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define('note', {
    title: {
      type: DataTypes.STRING,
      // validate: {
      //   len: [0, 20],
      // },
    },
    content: {
      type: DataTypes.STRING,
    },
    note_date: {
      type: DataTypes.DATEONLY ,
      validate: {
        isDate: true,
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
    },
  }, {
    freezeTableName: true,
    underscored: true,
  });
  Note.associate = function (models) {
    Note.belongsTo(models.user, {
      onDelete: "RESTRICT",
    })
  };
  return Note;
};