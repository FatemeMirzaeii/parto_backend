const express = require("express");
const checkDate = require("../middleware/checkDate");
const auth = require("../middleware/auth");
const { user, health_tracking_category, user_tracking_option, health_tracking_option } = require("../models");
const translate = require("../config/translate");
const router = express();
const { Op, where } = require("sequelize");
const handleError = require("../middleware/handleMysqlError");
const moment = require("moment");


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
  for (const element2 of req.body.deleted) {
    await user_tracking_option.destroy({
      where: {
        user_id: req.params.userId,
        date: req.body.date,
        tracking_option_id: element2.trackingOptionId
      }
    })
  }

  for (const element of req.body.selected) {
    if (element.hasMultipleChoice == 0) {
      existDate = await user_tracking_option.findOne({
        where: {
          user_id: req.params.userId,
          date: req.body.date
        }
      })
      if (existDate != null) {
        //find options in category
        let options = await health_tracking_option.findAll({
          attributes: ['id'],
          where: {
            category_id: element.categoryId
          }
        });

        //find all for that option in helthTracing 
        let optionArray = [];
        for (j = 0; j < options.length; j++) {
          optionArray.push(options[j].id);
        }

        existData = await user_tracking_option.findOne({
          where: {
            user_id: req.params.userId,
            date: req.body.date,
            tracking_option_id: { [Op.in]: optionArray }
          }
        })

        if (await existData != null) {
          await existData.destroy();
        }

      }
    }
    const trackingOption = await health_tracking_option.findByPk(element.trackingOptionId);
    userOption = await user_tracking_option.create({
      date: req.body.date
    });
    await userOption.setHealth_tracking_option(trackingOption)
      .then(userOption.setUser(usr).catch(async function (err) {
        await handleError(userOption, err);
      }))
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
  let syncTime, existOption;
  if (req.params.syncTime == "null") {
    existOption = await user_tracking_option.findAll({
      attributes: ['date', 'tracking_option_id'],
      where: {
        user_id: usrID,
      }
    })
  }
  else {
    syncTime = new Date(req.params.syncTime);
    let milliseconds = Date.parse(syncTime);
    milliseconds = milliseconds - ((3 * 60 + 30) * 60 * 1000);
    console.log("syncTime", syncTime);
    existOption = await user_tracking_option.findAll({
      attributes: ['date', 'tracking_option_id'],
      where: {
        user_id: usrID,
        updatedAt: {
          [Op.gte]: new Date(milliseconds),
        }
      },
      orderBy: [['group', 'DESC']],
    })

  }
  return res.status(200).json({ data: existOption });
});

router.post("/syncUserInfo/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null || req.body == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  if ((req.body.data).length == 0) {
    return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
  }
  let userOption, existData, optionIdExist;
  let error = 0;
  for (const element of req.body.data) {
    optionIdExist = await health_tracking_option.findByPk(element.tracking_option_id).catch(async function (err) {
      console.log("ERR- health_tracking_option.findByPk(element.tracking_option_id)", err);
      console.log(optionIdExist);
      error = 1;
      return;
    })

    if (element.state == 2) {
      let findData = await user_tracking_option.findOne({
        where: {
          user_id: req.params.userId,
          date: element.date,
          tracking_option_id: element.tracking_option_id
        }
      })
      await findData.setUser(null);
      await findData.setHealth_tracking_option(null);
      await findData.destroy();

    }
    else if (element.state == 1) {
      let categoryId = await health_tracking_option.findOne({
        attributes: ['category_id'],
        where: {
          id: element.tracking_option_id
        }
      });
      let choice = await health_tracking_category.findOne({
        attributes: ['has_multiple_choice'],
        where: {
          id: categoryId.category_id
        }
      });

      if (choice.has_multiple_choice == 0) {
        let options = await health_tracking_option.findAll({
          attributes: ['id'],
          where: {
            category_id: categoryId.category_id
          }
        });
        let optionArray = [];
        for (i = 0; i < options.length; i++) {
          optionArray.push(options[i].id);
        }

        existData = await user_tracking_option.findOne({
          where: {
            user_id: req.params.userId,
            date: element.date,
            tracking_option_id: { [Op.in]: optionArray }
          }
        })

        if (existData != null) {
          await existData.setHealth_tracking_option(optionIdExist);
        }
        else {
          try {
            userOption = await user_tracking_option.create({
              date: element.date
            });
            if (userOption != null) {
              await userOption.setHealth_tracking_option(optionIdExist).catch(async function (err) {
                let result = await handleError(userOption, err);
                if (!result) error = 1;
                return;
              })
              await userOption.setUser(usr).catch(async function (err) {
                let result2 = await handleError(userOption, err);
                if (!result2) error = 1;
                return;
              })
            }
          } catch (err) {
            let result3 = await handleError(userOption, err);
            if (!result3) error = 1;
            return;
          }
        }
      }
      else if (choice.has_multiple_choice == 1) {
        try {
          userOption = await user_tracking_option.create({
            date: element.date
          });
          if (userOption != null) {
            await userOption.setHealth_tracking_option(optionIdExist).catch(async function (err) {
              let result = await handleError(userOption, err);
              if (!result) error = 1;
              return;
            })
            await userOption.setUser(usr).catch(async function (err) {
              let result2 = await handleError(userOption, err);
              if (!result2) error = 1;
              return;
            })
          }
        } catch (err) {
          let result3 = await handleError(userOption, err);
          if (!result3) error = 1;
          return;
        }
      }
    }

  }
  if (error == 1) {
    return res.status(500).json({ message: await translate("SERVERERROR", req.params.lang) });
  }
  else {
    return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
  }

});

// router.get("/getPain/:userId/:lang", auth, async (req, res) => {
//   let usr = await user.findByPk(req.params.userId);
//   if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
//   let usrID;
//   if (usr.partner_id != null) {
//     usrID = usr.partner_id
//   }
//   else {
//     usrID = usr.id
//   }
//   let uPainDate = await user_tracking_option.findAll({
//     attributes: ['date', 'tracking_option_id'],
//     where: {
//       user_id: usrID,
//       tracking_option_id: {
//         [Op.or]: [5, 6, 7, 8]
//       }
//     }
//   })
//   res.status(200).json({ data: uPainDate });
// });

// router.get("/getExcersices/:userId/:lang", auth, async (req, res) => {
//   let usr = await user.findByPk(req.params.userId);
//   if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
//   let usrID;
//   if (usr.partner_id != null) {
//     usrID = usr.partner_id
//   }
//   else {
//     usrID = usr.id
//   }
//   let uPainDate = await user_tracking_option.findAll({
//     attributes: ['date', 'tracking_option_id'],
//     where: {
//       user_id: usrID,
//       tracking_option_id: {
//         [Op.or]: [21, 22, 23, 24]
//       }
//     }
//   })
//   res.status(200).json({ data: uPainDate });
// });

// router.get("/getSleep/:userId/:lang", auth, async (req, res) => {
//   let usr = await user.findByPk(req.params.userId);
//   if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
//   let usrID;
//   if (usr.partner_id != null) {
//     usrID = usr.partner_id
//   }
//   else {
//     usrID = usr.id
//   }
//   let uPainDate = await user_tracking_option.findAll({
//     attributes: ['date', 'tracking_option_id'],
//     where: {
//       user_id: usrID,
//       tracking_option_id: {
//         [Op.or]: [17, 18, 19, 20]
//       }
//     }
//   })
//   res.status(200).json({ data: uPainDate });
// });

// router.get("/getVaginalDischarges/:userId/:lang", auth, async (req, res) => {
//   let usr = await user.findByPk(req.params.userId);
//   if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
//   let usrID;
//   if (usr.partner_id != null) {
//     usrID = usr.partner_id
//   }
//   else {
//     usrID = usr.id
//   }
//   let uPainDate = await user_tracking_option.findAll({
//     attributes: ['date', 'tracking_option_id'],
//     where: {
//       user_id: usrID,
//       tracking_option_id: {
//         [Op.or]: [9, 10, 11, 12]
//       }
//     }
//   })
//   res.status(200).json({ data: uPainDate });
// });

// router.get("/getMood/:userId/:lang", auth, async (req, res) => {
//   let usr = await user.findByPk(req.params.userId);
//   if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
//   let usrID;
//   if (usr.partner_id != null) {
//     usrID = usr.partner_id
//   }
//   else {
//     usrID = usr.id
//   }
//   let uPainDate = await user_tracking_option.findAll({
//     attributes: ['date', 'tracking_option_id'],
//     where: {
//       user_id: usrID,
//       tracking_option_id: {
//         [Op.or]: [13, 14, 15, 16]
//       }
//     }
//   })
//   res.status(200).json({ data: uPainDate });
// });

// router.get("/getSex/:userId/:lang", auth, async (req, res) => {
//   let usr = await user.findByPk(req.params.userId);
//   if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
//   let usrID;
//   if (usr.partner_id != null) {
//     usrID = usr.partner_id
//   }
//   else {
//     usrID = usr.id
//   }
//   let uPainDate = await user_tracking_option.findAll({
//     attributes: ['date', 'tracking_option_id'],
//     where: {
//       user_id: usrID,
//       tracking_option_id: {
//         [Op.or]: [25, 26, 27, 28]
//       }
//     }
//   })
//   res.status(200).json({ data: uPainDate });
// });

router.get("/getUserHealthInfo/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let usrID;
  if (usr.partner_id != null) {
    usrID = usr.partner_id
  }
  else {
    usrID = usr.id
  }
  let categoryAndOptions = await health_tracking_option.findAll({
    attributes: ['id', 'category_id', 'title'],
    include: [
      {
        model: health_tracking_category,
        required: true,
        attributes: ['id', 'title', 'color']
      }
    ]
  })
  let result = [];
  let option = [];
  let j = 1;

  for (let i = 0; i < categoryAndOptions.length + 1; i++) {
    if (i == categoryAndOptions.length) {
      if (option.length != 0) {
        let temp = {};
        temp.categoryId = j;
        temp.categoryTitle = categoryAndOptions[i - 1].health_tracking_category.title;
        temp.categoryColor = categoryAndOptions[i - 1].health_tracking_category.color;
        temp.option = option;
        result.push(temp);
      }
      break;
    }

    if (categoryAndOptions[i].category_id != j) {
      if (option.length != 0) {
        let temp = {};
        temp.categoryId = j;
        temp.categoryTitle = categoryAndOptions[i - 1].health_tracking_category.title;
        temp.categoryColor = categoryAndOptions[i - 1].health_tracking_category.color;
        temp.option = option;
        result.push(temp);
      }
      option = [];
      j++
    }

    if (categoryAndOptions[i].category_id == j) {
      let temp = await user_tracking_option.findAll({
        attributes: ['date'],
        where: {
          user_id: usrID,
          tracking_option_id: categoryAndOptions[i].id
        }
      })
      console.log("temp", temp.length > 0)
      if (temp.length > 0) {
        let tOption = {};
        tOption.trackingOptionId = categoryAndOptions[i].id;
        tOption.title = categoryAndOptions[i].title;
        let dateArray = [];
        temp.forEach(d => {
          dateArray.push(d.date);
        })
        tOption.date = dateArray;
        option.push(tOption);
      }

    }
  }
  return res.status(200).json({ data: result });
});

router.get("/analysisDataByDate/:userId/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let usrID;
  if (usr.partner_id != null) {
    usrID = usr.partner_id
  }
  else {
    usrID = usr.id
  }
  let info = await user_tracking_option.findAll({
    attributes: ['date', 'tracking_option_id'],
    where: {
      user_id: usrID
    }
  })

  let categoryAndOptions = await health_tracking_option.findAll({
    attributes: ['id', 'category_id', 'title'],
    include: [
      {
        model: health_tracking_category,
        required: true,
        attributes: ['id', 'title', 'color']
      }
    ]
  })

  let result = [];
  let days = {};
  for (let i of info) {
    let options = [];

    for (let t of info) {
      if (i.date == t.date) {
        options.push(t.tracking_option_id);
      }
    }
    let exist = false;
    for (let r of result) {
      if (i.date == r.date) {
        console.log("is existtttt");
        console.log("date", i.date);
        exist = true;
      }
    }
    if (exist == false) {

      days.date = i.date;
      console.log("date1", i.date);
      let temp = [];
      let j;
      for (j of options) {

        let temp2 = {};
        for (let k of categoryAndOptions) {

          if (j == k.id) {
            temp2.categoryId = k.category_id;
            temp2.categoryTitle = k.health_tracking_category.title;
            temp2.categoryColor = k.health_tracking_category.color;
            temp2.optionId = k.id;
            temp2.optionTitle = k.title;
            temp.push(temp2);
            break;
          }
        }
      }
      days.options = temp;

      result.push({ date: days.date, options: days.options });
    }
  }
  return res.status(200).json({ data: result });

});


module.exports = router;
