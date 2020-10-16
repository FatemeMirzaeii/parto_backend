const express = require("express");
const { user , survey_question , user_answer_survey} = require("../models");
const router = express.Router();
const translate = require("../config/translate");
const jwt = require("jsonwebtoken");
var fs = require("fs");
let auth = require("../middleware/auth");
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
  

router.get("/question/:lang", async (req,res) => {
  let posetivQuestion= await survey_question.findAll({
    attributes: ['id', 'answer'],
    where:{
      weakness:0,
    }
  });
  let negativeQuestion= await survey_question.findAll({
    attributes: ['id', 'answer'],
    where:{
      weakness:1,
    }
  });
  
  res.status(200).json({posetivQuestion:posetivQuestion ,negativeQuestion:negativeQuestion});

});

router.post("/answers/:lang", async (req, res,next) => {
  const lang=req.params.lang ;
    
  if (!req.body.rate ) return res.status(400).json({ message: await translate("INVALIDENTRY", lang) });
  
  let userAnswers;
  if(req.body.userId!=null && req.body.userId!=0){
    auth(req,res,next);
  }
  return res.status(200).json({message: await translate("SUCCESSFUL",lang)});
  
});
module.exports = router;
