'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pregnancy = sequelize.define('pregnancy', {
    pregnancy_week: DataTypes.INTEGER,
    abortion: {
      type: DataTypes.BOOLEAN,
    },
    conception_date: DataTypes.DATEONLY ,
    abortion_date:DataTypes.DATEONLY,
    children_number:DataTypes.INTEGER,
    kick_count: DataTypes.INTEGER,
    due_date: {
      type: DataTypes.DATEONLY ,
      validate: {
        isDate: true,
      },
    },
    state: {
      type: DataTypes.ENUM('1', '2', '3'),
      defaultValue:1,
    }
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