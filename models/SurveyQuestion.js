'use strict';
module.exports = (sequelize, DataTypes) => {
  const SurveyQuestion = sequelize.define('survey_answers', {
    question:{
      type: DataTypes.TEXT
    },
    weakness:{
      type: DataTypes.BOOLEAN
    },
  }, {});
  SurveyQuestion.associate = function(models) {
    // associations can be defined here
  };
  return SurveyQuestion;
};
