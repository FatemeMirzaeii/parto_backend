
const express = require("express");
const { user } = require("../models");
const bcrypt = require("bcrypt");
const router = express.Router();
const translate = require("../config/translate");
const sendEmail=require("../middleware/sendEmail");
const Kavenegar = require('kavenegar');
var cookie = require('cookie');

router.post("/signIn/:lang", async (req, res) => {
  let usr ;
  if(req.body.phone==""){
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  if(req.body.phone!=""){
    const regex = RegExp(/^(\+98|0098|98|0)?9\d{9}$/g);
    let check=regex.test(req.body.phone); 
    
    if (!check) return res.status(400).json({ message: await translate("INVALIDENTRY", "fa") });
    
    usr = await user.findOne({
      where: {
        phone: req.body.phone,
      },
    });
  }
  // else{
  //   usr = await user.findOne({
  //     where: {
  //       email: req.body.email,
  //     },
  //   });
  // }
  if (usr==null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  // const pass = await bcrypt.compare(req.body.password, usr.password);
  // if (!pass) return res.status(400).json({ message: await translate("WRONGPASSWORD", req.params.lang) });
  const token = await usr.generateAuthToken();
  console.log("token",token);
  await usr.createUser_log({
    i_p: req.header("x-forwarded-for"),
    version: req.body.version,
    login_date: Date.now(),
  });
  res.header("x-auth-token", token).status(200).json({ data: { id: usr.id ,userName:usr.name} });
});

router.post("/logIn/:lang",async(req,res)=>{
  let usr ;
  if(req.body.phone==""){
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  if(req.body.phone!=""){
    const regex = RegExp(/^(\+98|0098|98|0)?9\d{9}$/g);
    let check=regex.test(req.body.phone); 
    
    if (!check) return res.status(400).json({ message: await translate("INVALIDENTRY", "fa") });
    
    usr = await user.findOne({
      where: {
        phone: req.body.phone,
      },
    });
  }
  // else{
  //   usr = await user.findOne({
  //     where: {
  //       email: req.body.email,
  //     },
  //   });
  // }
  
  if (usr==null){
    if(req.body.imei!=null && req.body.imei!="") {
      const regex = RegExp(/^\d{15}$/g);
      let check=regex.test(req.body.imei); 
      if (!check)  return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    
      usr = await user.create({
        name: req.body.name,
        phone: req.body.phone,
        //email: req.body.email,
        //password: hash,
        imei:req.body.imei,
      });
    }
    else{
      usr = await user.create({
        name: req.body.name,
        phone: req.body.phone
      });
    }
  }
  const token =await usr.generateAuthToken();
  console.log("tok",token)
  await usr.createUser_log({
    i_p: req.header("x-forwarded-for"),
    version: req.body.version,
    login_date: Date.now(),
  });

  return res
  .cookie('xAuthToken', String(token), {maxAge: 86_400_000,httpOnly: false})
  .status(200)
  .json({ data: { id: usr.id ,userName:usr.name} });

})

router.post("/verifyCode", async(req, res) => {
  let code= Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
  if(req.body.phone!=""){
    const regex = RegExp(/^(\+98|0098|98|0)?9\d{9}$/g);
    let check=regex.test(req.body.phone); 
    
    if (!check) return res.status(400).json({ message: await translate("INVALIDENTRY", "fa") });
    else{
      let api = Kavenegar.KavenegarApi({
        apikey: '6D58546F68663949326476336B636A354F39542B474B47456D564A68504361377154414D78446D637263383D'
      });
      
      api.VerifyLookup({
          receptor: req.body.phone,
          token: code.toString(),
          template: "verificationCode",
      }, 
      async(response, status,message)=> {
              
        if (status==418){
          sendEmail('info@partobanoo.com','parto@partobanoo.com',message,"ارور سامانه پیامکی ");
        }
        else if (status==200){
          return res.status(200).json({data:{message:message,code:code}});
        } 
        
        return res.status(status).json({message:message});
        
      })
    }
  }
  // else{
  //   const regex = RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,3})$/);
  //   let check=regex.test(req.body.email); 
    
  //   if (!check) return res.status(400).json({ message: await translate("INVALIDENTRY", "fa") });
  //   else{
  //     const subject='Verification Code for parto application ';
  //     let text =`کد فعالسازی شما : ${code}  `;
  //     const result=sendEmail('parto@partobanoo.com',req.body.email,text,subject);
  //     if(result=="ERROR") return res.status(502).json({message: await translate("SERVERERROR", "fa")});
  //     else return res.status(200).json({data:{ message: await translate("SUCCESSFUL", "fa") , code:code}})
  //   }
  // }
});


module.exports = router;
