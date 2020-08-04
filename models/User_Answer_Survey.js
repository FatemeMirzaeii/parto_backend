'use strict';
module.exports = (sequelize, DataTypes) => {
  const User_Answer_Survey = sequelize.define('user_answer_survey', {
    answers: DataTypes.STRING,
    description: DataTypes.TEXT,
    rate: DataTypes.INTEGER,
    IMEI: DataTypes.STRING
  }, {});
  User_Answer_Survey.associate = function(models) {
    User_Answer_Survey.belongsTo(models.user, {
      onDelete: "RESTRICT",
    });
  };
  return User_Answer_Survey;
};