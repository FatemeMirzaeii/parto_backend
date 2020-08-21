const express = require("express");
const { user , survey_answer , user_answer_survey} = require("../models");
const router = express.Router();
const translate = require("../config/translate");
const jwt = require("jsonwebtoken");
var fs = require("fs");
const secret = fs.readFileSync("../private.key", "utf8");

function authentication (token){
  if (!token)   return "401";
  var decoded = jwt.decode(token, {complete: true});
  if(decoded!=null){
    jwt.verify(token, secret);
    return "200";
  }
  return "400";
};
  
router.post("/surveyQuestion/:lang", async (req,res) => {
  let answers= await survey_answer.findAll({
    attributes: ['id', 'answer']
  });
  let userAnswers;
  if(req.body.userId!=null  && req.body.userId!=0){
    if(authentication( req.header("x-auth-token"))=="200"){
      userAnswers= await user_answer_survey.findOne({
        where:{
          userId:req.body.userId
        },
      })
    }
    else if (authentication( req.header("x-auth-token"))=="401"){
      return res.status(401).json({ message: await translate("NOPERMISSION", req.params.lang) });
    }
    else {
      return  res.status(400).json({ message: await translate("INVALIDTOKEN", req.params.lang) });
    }
   
  }
  else{
    const regex = RegExp(/^\d{15}$/g);
    let check=regex.test(req.body.IMEi);
    if (!check) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    else{
      userAnswers= await user_answer_survey.findOne({
          where:{
            IMEI:req.body.IMEi
          },
      })
    }
  }
  userAnswer="";
  userDescription="";
  if(userAnswers!=null){
    userAnswer=userAnswers.answers;
    userDescription=userAnswers.description;
  }
  res.status(200).json({answers:answers , userAnswers:userAnswer ,userDescription:userDescription});

});

router.put("/userSurveyAnswer/:lang", async (req, res) => {
    
  if (!req.body.rate ) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  
  let userAnswers;
  if(req.body.userId!=null && req.body.userId!=0){
    
    if(authentication( req.header("x-auth-token"))=="200"){
      userAnswers= await user_answer_survey.findOne({
        where:{
          userId:req.body.userId
        },
      })
    }
    else if (authentication( req.header("x-auth-token"))=="401"){
      return res.status(401).json({ message: await translate("NOPERMISSION", req.params.lang) });
    }
    else {
      return  res.status(400).json({ message: await translate("INVALIDTOKEN", req.params.lang) });
    }

  }
  else{
    const regex = RegExp(/^\d{15}$/g);
    let check=regex.test(req.body.IMEi);
    if (!check)  return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    else{
      userAnswers= await user_answer_survey.findOne({
          where:{
            IMEI:req.body.IMEi
          },
      })
    }
  }
  
  if(userAnswers!=null ) {
    if(req.body.userId>0){
      const usr = await user.findOne({
        where: {
          id: req.body.userId,
        },
      });
      if (!usr) return res.status(400).json({ message: await translate("INVALIDID",req.params.lang) });
      
      if(userAnswers.IMEI!=req.body.IMEi){
        userAnswers.update({IMEI:req.body.IMEi});
        usr.update({imei:req.body.IMEi})
      }
            
      await usr.createUser_log({
        i_p: req.header("x-forwarded-for"),
        version: req.body.version,
        login_date: Date.now(),
      });

      userAnswers.update({
          userId:req.body.userId,
          answers:req.body.answers , 
          description:req.body.description,
          rate:req.body.rate
      });
    }
    else{
      userAnswers.update({
        answers:req.body.answers , 
        description:req.body.description,
        rate:req.body.rate
     });
    }
  }
  else{
    if(req.body.userId>0){
      const usr = await user.findOne({
        where: {
          id: req.body.userId,
        },
      });
      if (!usr) return res.status(400).json({ message: await translate("INVALIDID",req.params.lang) });
      
      await usr.createUser_log({
        i_p: req.header("x-forwarded-for"),
        version: req.body.version,
        login_date: Date.now(),
      });
      
      user_answer_survey.create({
        userId:usr.id,
        IMEI:req.body.IMEi,
        answers:req.body.answers ,
        description:req.body.description,
        rate:req.body.rate
     })

    }
    else{
      user_answer_survey.create({
          IMEI:req.body.IMEi,
          answers:req.body.answers ,
          description:req.body.description,
          rate:req.body.rate
      })
    }
  }
  return res.status(200).json({message: await translate("SUCCESSFUL",req.params.lang )});
  
});
module.exports = router;
