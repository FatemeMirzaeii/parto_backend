const express = require("express");
const { user , survey_answer , user_answer_survey} = require("../models");
const router = express.Router();
const translate = require("../config/translate");
const auth = require("../middleware/auth");


router.post("/surveyQuestion/:lang",auth, async (req, res) => {
  const usr = await user.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!usr) return res.status(400).json({ message: await translate("INVALIDID", req.params.lang) });
  let answers= await survey_answer.findAll({
    attributes: ['id', 'answer']
  });
  const userAnswers= await user_answer_survey.findOne({
      where:{
        userId:usr.id
      },
  })
  res.status(200).json({answers:answers , userAnswers:userAnswers.answers ,userDescription:userAnswers.description});

});

router.post("/userSurveyAnswer/:lang",auth, async (req, res) => {
    const usr = await user.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!usr) return res.status(400).json({ message: await translate("INVALIDID", req.params.lang) });
    usr.update({rate:req.body.rate});
    const userAnswers= await user_answer_survey.findOne({
        where:{
          userId:usr.id
        },
    })
    if(userAnswers) {
        userAnswers.update({
            answers:req.body.answers , 
            description:req.body.description
        });
    }
    else{
        user_answer_survey.create({
            userId:usr.id,
            answers:req.body.answers ,
            description:req.body.description
        })
    }
    res.status(200).json({message: await translate("SUCCESSFUL", req.params.lang)});
  
  });
module.exports = router;
