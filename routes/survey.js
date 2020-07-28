const express = require("express");
const { user , survey_answer , user_answer_surveys} = require("../models");
const router = express.Router();
const translate = require("../config/translate");


router.post("/surveyQuestion", async (req, res) => {
  const usr = await user.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!usr) return res.status(400).json({ message: await translate("EMAILEXISTS", req.params.lang) });
  const answers= await survey_answer.findAll();
  const userAnswers= await user_answer_surveys.findAll({
      where:{
        userId:usr.id
      },
  })
  res.status(200).json({answers:answers , userAnswers:userAnswers.answers ,userDescription:userAnswers.descripthion});

});

//
module.exports = router;
