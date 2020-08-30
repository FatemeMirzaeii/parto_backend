'use strict';
module.exports = (sequelize, DataTypes) => {
  const SurveyAnswer = sequelize.define('survey_answer', {
    answer: DataTypes.TEXT
  }, {});
  SurveyAnswer.associate = function(models) {
    // associations can be defined here
  };
  return SurveyAnswer;
};