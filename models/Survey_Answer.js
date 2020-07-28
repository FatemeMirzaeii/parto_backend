'use strict';
module.exports = (sequelize, DataTypes) => {
  const Survey_Answer = sequelize.define('survey_answer', {
    answer: DataTypes.TEXT
  }, {});
  Survey_Answer.associate = function(models) {
    // associations can be defined here
  };
  return Survey_Answer;
};