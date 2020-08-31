'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pregnancy = sequelize.define('pregnancy', {
    several_weeks: DataTypes.INTEGER,
    abortion: {
      type: DataTypes.BOOLEAN,
    },
    zygosis_date: DataTypes.DATEONLY ,
    due_date: {
      type: DataTypes.DATEONLY ,
      validate: {
        isDate: true,
      },
    },
  }, {
    freezeTableName: true,
    underscored: true,
  });
  Pregnancy.associate = function (models) {
    Pregnancy.belongsTo(models.user, {
      onDelete: "RESTRICT",
    })
  };
  return Pregnancy;
};