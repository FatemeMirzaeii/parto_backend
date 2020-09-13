'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserAnswerSurvey = sequelize.define('user_answer_survey', {
    answers: DataTypes.STRING,
    description: DataTypes.TEXT,
    rate: DataTypes.INTEGER,
    IMEI: DataTypes.STRING
  }, {});
  UserAnswerSurvey.associate = function(models) {
    UserAnswerSurvey.belongsTo(models.user, {
      onDelete: "RESTRICT",
    });
  };
  return UserAnswerSurvey;
};