const express = require("express");
const checkDate = require("../middleware/checkDate");
const auth = require("../middleware/auth");
const { user, health_tracking_category, user_tracking_option, health_tracking_option } = require("../models");
const translate = require("../config/translate");
const router = express();
const { Op } = require("sequelize");

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

router.get("/userInfo/:userId/:date/:lang", auth, checkDate, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let usrID;
  if (usr.partner_id != null) {
    usrID = usr.partner_id
  }
  else {
    usrID = usr.id
  }

  let data = [];
  let userOption = [];
  let i, j, option;
  let category = await health_tracking_category.findAll({
    attributes: ['id', 'title', 'has_multiple_choice', 'color', 'icon']
  });
  for (i = 0; i < category.length; i++) {
    let temp = {};
    temp.id = category[i].id;
    temp.title = category[i].title;
    temp.hasMultipleChoice = category[i].has_multiple_choice;
    temp.color = category[i].color;
    temp.icon = category[i].icon;
    option = (await health_tracking_option.findAll({
      attributes: ['id', 'title', 'icon'],
      where: {
        category_id: category[i].id
      }
    }))
    let optionList = [];

    if (option.length > 0) {
      for (j = 0; j < option.length; j++) {
        let optionsTemp = {};
        userOption[j] = await user_tracking_option.findAll({
          attributes: ['id', 'tracking_option_id'],
          where: {
            user_id: usrID,
            tracking_option_id: option[j].id,
            date: req.params.date
          }
        })
        if (userOption[j] == null) userOption[j] = [];
        optionsTemp.id = option[j].id;
        optionsTemp.title = option[j].title;
        optionsTemp.icon = option[j].icon;
        optionsTemp.selected = userOption[j];
        optionList.push(optionsTemp);

      }
    }
    temp.options = optionList;
    data.push(temp);
  }

  return res.status(200).json({ data: data });
});

router.post("/userInfo/:userId/:lang", auth, checkDate, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

  let userOption, existDate;
  for (i = 0; i < req.body.deleted.length; i++) {
    await user_tracking_option.destroy({
      where: {
        user_id: req.params.userId,
        date: req.body.date,
        tracking_option_id: req.body.deleted[i].trackingOptionId
      }
    })
  }
  for (i = 0; i < req.body.selected.length; i++) {
    if (req.body.selected[i].hasMultipleChoice == 0) {
      existDate = await user_tracking_option.findOne({
        where: {
          user_id: req.params.userId,
          date: req.body.date
        }
      })
      if (existDate != null) {
        //find options in category
        let category = await health_tracking_option.findAll({
          attributes: ['id'],
          where: {
            category_id: req.body.selected[i].categoryId
          }
        });
        //find all for that option in helthTracing 
        for (option in category) {
          existOption = await user_tracking_option.findOne({
            where: {
              user_id: req.params.userId,
              date: req.body.date,
              tracking_option_id: option
            }
          })
          //delete it
          if (existOption) {
            await user_tracking_option.destroy({
              where: {
                user_id: req.params.userId,
                date: req.body.date,
                tracking_option_id: option
              }
            })
          }
        }

      }
    }
    userOption = await user_tracking_option.create({
      tracking_option_id: req.body.selected[i].trackingOptionId,
      date: req.body.date
    });
    await userOption.setUser(usr);
  }
  return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
});

router.get("/syncUserInfo/:userId/:syncTime/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let usrID;
  if (usr.partner_id != null) {
    usrID = usr.partner_id
  }
  else {
    usrID = usr.id
  }

  let userOption = await user_tracking_option.findOne({
    where: {
      user_id: usrID
    }
  })
  if (userOption == null) return res.status(200).json({ data: userOption });
  console.log("userOption", userOption);
  let syncTime;
  if (req.params.syncTime == "null" || req.params.syncTime == null) {
    syncTime = userOption.updatedAt;
  }
  else {
    syncTime = new Date(req.params.syncTime);
  }
  console.log("syncTime", syncTime);

  let existOption = await user_tracking_option.findAll({
    attributes: ['date', 'tracking_option_id'],
    where: {
      user_id: usrID,
      updatedAt: {
        [Op.gte]: syncTime
      }
      // ,
      // createdAt: {
      //   [Op.gte]: syncTime
      // }
    },
    orderBy: [['group', 'DESC']],
  })

  return res.status(200).json({ data: existOption });
});

router.post("/syncUserInfo/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  if ((req.body.data).length == 0) {
    return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
  }
  let userOption, existData;
  let result = 200;
  req.body.data.forEach(async element => {
    console.log("stateeeeee", element.state);
    if (element.state == 2) {
      await user_tracking_option.destroy({
        where: {
          user_id: req.params.userId,
          date: element.date,
          tracking_option_id: element.tracking_option_id
        }
      })
    }
    else if (element.state == 1) {
      if (element.has_multiple_choice == 0) {
        existData = await user_tracking_option.findOne({
          where: {
            user_id: req.params.userId,
            date: element.date
          }
        })
        if (existData != null) {
          await existData.update({ tracking_option_id: element.tracking_option_id });
        }
        else {
          userOption = await user_tracking_option.create({
            tracking_option_id: element.tracking_option_id,
            date: element.date
          });
          await userOption.setUser(usr);
        }
      }
      else {
        userOption = await user_tracking_option.create({
          tracking_option_id: element.tracking_option_id,
          date: element.date
        });
        await userOption.setUser(usr);
      }
    }
    else { result = 400; }

  })
  if (result == 400) {
    return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  }
  else {
    return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
  }
});

router.get("/getPains/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let usrID;
  if (usr.partner_id != null) {
    usrID = usr.partner_id
  }
  else {
    usrID = usr.id
  }
  let uPainDate = await user_tracking_option.findAll({
    attributes: ['date', 'tracking_option_id'],
    where: {
      user_id: usrID,
      tracking_option_id: {
        [Op.or]: [5,6,7,8]
      }
    }
  })
  res.status(200).json({ data: uPainDate });
});

router.get("/getSports/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let usrID;
  if (usr.partner_id != null) {
    usrID = usr.partner_id
  }
  else {
    usrID = usr.id
  }
  let uPainDate = await user_tracking_option.findAll({
    attributes: ['date', 'tracking_option_id'],
    where: {
      user_id: usrID,
      tracking_option_id: {
        [Op.or]: [21,22,23,24]
      }
    }
  })
  res.status(200).json({ data: uPainDate });
});

router.get("/getSleepHours/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let usrID;
  if (usr.partner_id != null) {
    usrID = usr.partner_id
  }
  else {
    usrID = usr.id
  }
  let uPainDate = await user_tracking_option.findAll({
    attributes: ['date', 'tracking_option_id'],
    where: {
      user_id: usrID,
      tracking_option_id: {
        [Op.or]: [17,18,19,20]
      }
    }
  })
  res.status(200).json({ data: uPainDate });
});

router.get("/getSecretions/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let usrID;
  if (usr.partner_id != null) {
    usrID = usr.partner_id
  }
  else {
    usrID = usr.id
  }
  let uPainDate = await user_tracking_option.findAll({
    attributes: ['date', 'tracking_option_id'],
    where: {
      user_id: usrID,
      tracking_option_id: {
        [Op.or]: [9,10,11,12]
      }
    }
  })
  res.status(200).json({ data: uPainDate });
});

router.get("/getGeneralMoods/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let usrID;
  if (usr.partner_id != null) {
    usrID = usr.partner_id
  }
  else {
    usrID = usr.id
  }
  let uPainDate = await user_tracking_option.findAll({
    attributes: ['date', 'tracking_option_id'],
    where: {
      user_id: usrID,
      tracking_option_id: {
        [Op.or]: [13,14,15,16]
      }
    }
  })
  res.status(200).json({ data: uPainDate });
});

router.get("/getMarriage/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let usrID;
  if (usr.partner_id != null) {
    usrID = usr.partner_id
  }
  else {
    usrID = usr.id
  }
  let uPainDate = await user_tracking_option.findAll({
    attributes: ['date', 'tracking_option_id'],
    where: {
      user_id: usrID,
      tracking_option_id: {
        [Op.or]: [25,26,27,28]
      }
    }
  })
  res.status(200).json({ data: uPainDate });
});

module.exports = router;
