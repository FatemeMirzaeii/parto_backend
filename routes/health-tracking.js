const express = require("express");
const auth = require("../middleware/auth");
const {  health_tracking_category,  user_tracking_option , health_tracking_option} = require("../models");
const translate = require("../config/translate");
const router = express();

router.get("/getCategories", auth, async (req, res) => {
  const categories = await health_tracking_category.findAll();
  res.status(200).json({ data: categories });
});

router.post("/addCategory/:lang", auth, async (req, res) => {
  const exists = await health_tracking_category.findOne({
    where: {
      title: req.body.title
    }
  });
  if (exists) return res.status(400).json({ message: await translate("CATEGORYEXISTS", req.params.lang) });
  const cat = await health_tracking_category.create({
    title: req.body.title
  });
  res.status(200).json({ data: { id: cat.id, title: cat.title } });
});

router.put("/editCategory/:lang/:id", auth, async (req, res) => {
  const exists = await health_tracking_category.findByPk(req.params.id);
  if (!exists) return res.status(404).json({ message: await translate("NOSUCHCATEGORY", req.params.lang) });
  await health_tracking_category.update({
    title: req.body.title
  },
    {
      where: {
        id: req.params.id
      }
    });
  res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) }); //todo: add key
});

router.delete("/deleteCategory/:lang/:id", auth, async (req, res) => {
  const exists = await health_tracking_category.findByPk(req.params.id);
  if (!exists) return res.status(404).json({ message: await translate("NOSUCHCATEGORY", req.params.lang) });
  await health_tracking_category.destroy({
    where: {
      id: req.params.id
    }
  });
  res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) }); //todo: add key
});

router.get("/userInf/:userId/:date",auth,async(req,res)=>{
  let data,userOption=[];
  let i,j,option;
  let category = await health_tracking_category.findAll({
    attributes: ['id', 'title','has_multiple_choice','color','icon']
  });
  for (i = 0; i < category.length; i++) {
    let temp={};
    temp.id=category[i].id;
    temp.title=category[i].title;
    temp.hasMultioleChoise=category[i].has_multiple_choice;
    temp.color=category[i].color;
    temp.icon=category[i].icon;
    option=(await health_tracking_option.findAll({
      attributes: ['id', 'title','icon'],
      where:{
        category_id:category[i].id
      }
    }))
    let optionList=[];
    
    if(option.length>0){
      for(j=0 ;j<option.length;j++){
        let optionsTemp={};
        userOption[j]=await user_tracking_option.findAll({
          attributes: ['id', 'tracking_option_id'],
          where:{
            user_id: req.params.userId,
            tracking_option_id: option[j].id,
            date: req.params.date
          }
        })
        
        optionsTemp.id=option[j].id;
        optionsTemp.title=option[j].title;
        optionsTemp.icon=option[j].icon;
        optionsTemp.slected=userOption[j];
        optionList.push(optionsTemp);
       
      }
    }
    temp.options=optionList;
    data.push(temp);
  }
  
  return res.status(200).json({ data:data });
});

router.post("/userInf",auth,async(req,res)=>{
  const exist=(await health_tracking_option.findOne({
    where:{
      id:req.body.trackingOptionId
    }
  }))
  if(!exist) return res.status(400).json({ message: await translate("INVALIDENTRY", "fa") });

  let usr = await user.findOne({
    where: {
      phone: req.body.phone,
    },
  });
  if (usr==null) return res.status(400).json({ message: await translate("INVALIDENTRY", "fa") });
   
  let userOption,existData;
  for(i=0;i<req.body.trackingOptionId.length;i++){  
    existData=await user_tracking_option.findOne({
      where:{
        user_id: req.body.userId,
        tracking_option_id: trackingOptionId[i],
        date: req.body.date
      }
    })
    if (existData!=null) return res.status(409).json({ message: await translate("EXISTS", "fa") });
  
    userOption= await user_tracking_option.create({
      tracking_option_id:req.body.trackingOptionId[i],
      date:req.body.date
    });
    await userOption.setUser(usr);
  }
  return res.status(200).json({ message: await translate("SUCCESSFUL", "fa") });
  
});

module.exports = router;
