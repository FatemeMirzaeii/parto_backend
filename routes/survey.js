const express = require("express");
const { user , survey_answers , user_answer_survey} = require("../models");
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
  let posetivQuestion= await survey_answers.findAll({
    attributes: ['id', 'question'],
    where:{
      weakness:0,
    }
  });
  let negativeQuestion= await survey_answers.findAll({
    attributes: ['id', 'question'],
    where:{
      weakness:1,
    }
  });
  
  res.status(200).json({posetivQuestion:posetivQuestion ,negativeQuestion:negativeQuestion});

});

router.put("/answers/:lang", async (req, res) => {
  let usr ;
  if (!req.body.rate|| req.body.rate==0  ) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  if(req.body.IMEi !=null && req.body.IMEi !=""){
    //check code
    console.log("ok");
    await user_answer_survey.create({
      IMEI:req.body.IMEi,
      answers:req.body.answers ,
      description:req.body.description,
      rate:req.body.rate
   })
  }

  else if(req.body.userId!=null && req.body.userId!=0){
    console.log("ok");
    if (authentication( req.header("x-auth-token"))=="401"){
      return res.status(401).json({ message: await translate("NOPERMISSION", req.params.lang) });
    }
    else if(authentication( req.header("x-auth-token"))=="400") {
      return  res.status(400).json({ message: await translate("INVALIDTOKEN", req.params.lang) });
    }
    usr = await user.findByPk(req.body.userId);
    if (usr==null){
       return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
    }
    let survey=await user_answer_survey.create({
      answers:req.body.answers ,
      description:req.body.description,
      rate:req.body.rate
   })
   await survey.setUser(usr);

  }
  else{
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  
  return res.status(200).json({message: await translate("SUCCESSFUL",req.params.lang)});
  
});
module.exports = router;
