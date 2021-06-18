const express = require("express");
const checkDate = require("../../middleware/checkDate");
const auth = require("../../middleware/auth");
const { user, health_tracking_category, user_tracking_option, health_tracking_option, user_tracking_category } = require("../../models");
const translate = require("../../config/translate");
const router = express();
const { Op} = require("sequelize");
const handleError = require("../../middleware/handleMysqlError");


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
  let infoO = await user_tracking_option.findAll({
    attributes: ['date', 'tracking_option_id'],
    where: {
      user_id: usrID
    }
  })
  infoO.sort(function (a, b) { return a.tracking_option_id - b.tracking_option_id });
  let infoC = await user_tracking_category.findAll({
    attributes: ['date', 'tracking_category_id', 'value'],
    where: {
      user_id: usrID
    }
  })
  console.log("infoC", infoC[0])
  let category = await health_tracking_category.findAll({
    attributes: ['id', 'title', 'color'],
  })
  let categoryAndOptions = await health_tracking_option.findAll({
    attributes: ['id', 'category_id', 'title'],
    include: [
      {
        model: health_tracking_category,
        required: true,
        attributes: ['id', 'title', 'color', 'has_multiple_choice']
      }
    ]
  })
  categoryAndOptions.sort(function (a, b) { return a.category_id - b.category_id });
  let result = [];
  let days = {};
  for (let i of infoO.concat(infoC)) {
    let options = [];
    let categories = []
    for (let t of infoO.concat(infoC)) {
      if (i.date == t.date) {
        if (t.tracking_option_id != undefined) {
          options.push(t.tracking_option_id);
        }
        else {
          let obj = {};
          obj["value"] = t.value;
          obj["tracking_category_id"] = t.tracking_category_id;
          categories.push(obj);
        }
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
      console.log("value", i.value);
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
            temp2.hasValue = 0;
            temp.push(temp2);
            break;
          }
        }
      }

      let c;
      for (c of categories) {

        let temp2 = {};
        for (let k of category) {

          if (c.tracking_category_id == k.id) {
            temp2.categoryId = k.id;
            temp2.categoryTitle = k.title;
            temp2.categoryColor = k.color;
            temp2.hasValue = 1;
            temp2.value = c.value;
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

router.get("/:userId/syncUserTracking/:syncTime/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  let usrID;
  if (usr.partner_id != null) {
    usrID = usr.partner_id;
  }
  else {
    usrID = usr.id;
  }

  let userOption = await user_tracking_option.findOne({
    where: {
      user_id: usrID
    }
  })
  if (userOption == null) return res.status(200).json({ data: userOption });

  let syncTime, existOption, existCategory;
  if (req.params.syncTime == "null") {
    existOption = await user_tracking_option.findAll({
      attributes: ['date', 'tracking_option_id'],
      where: {
        user_id: usrID,
      }
    });
    existCategory = await user_tracking_category.findAll({
      attributes: ['tracking_category_id', 'date', 'value'],
      where: {
        user_id: usrID,
      }
    });
  }
  else {
    syncTime = new Date(req.params.syncTime);
    let milliseconds = Date.parse(syncTime);
    milliseconds = milliseconds - ((4 * 60 + 30) * 60 * 1000);

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
    existCategory = await user_tracking_category.findAll({
      attributes: ['tracking_category_id', 'date', 'value'],
      where: {
        user_id: usrID,
        updatedAt: {
          [Op.gte]: new Date(milliseconds),
        }
      },
      orderBy: [['group', 'DESC']],
    });

  }
  return res
    .status(200)
    .json(
      {
        status: "success",
        data: { nonDescriptive: existOption, descriptive: existCategory },
        message: await translate("SUCCESSFUL", req.params.lang)
      });
});

router.post("/:userId/syncUserTracking/:syncTime/:lang", auth, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null || req.body == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
  if ((req.body.data).length == 0) {
    return res
      .status(200)
      .json({ message: await translate("SUCCESSFUL", req.params.lang) });
  }
  let userOption, existData, optionIdExist;
  let error = 0;
  for (const element of req.body.nonDescriptive) {
    optionIdExist = await health_tracking_option.findByPk(element.tracking_option_id).catch(async function (err) {
      console.log("ERR- health_tracking_option.findByPk(element.tracking_option_id)", err);
      console.log(optionIdExist);
      error = 1;
      return;
    })


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
  for (const element of req.body.descriptive) {
    optionIdExist = await health_tracking_category.findByPk(element.tracking_category_id).catch(async function (err) {
      console.log("ERR- tracking_category_id.findByPk(element.tracking_option_id)", err);
      console.log(optionIdExist);
      error = 1;
      return;
    })
    if (element.state == 2) {
      await user_tracking_category.destroy({
        where: {
          user_id: req.params.userId,
          date: element.date,
          tracking_category_id: element.tracking_category_id
        }
      })
    }
    else if (element.state == 1) {
      
        existData = await user_tracking_category.findOne({
          where: {
            user_id: req.params.userId,
            date: element.date,
            tracking_category_id: element.tracking_category_id
          }
        })

        if (existData != null) {
          await existData.update({value:element.value});
        }
        else {
          try {
            userOption = await category.create({
              date: element.date,
              value:element.value
            });
            if (userOption != null) {
              await userOption.setHealth_tracking_category(optionIdExist).catch(async function (err) {
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
    return res
    .status(500)
    .json({ message: await translate("SERVERERROR", req.params.lang) });
  }
  else {
    return res
    .status(200)
    .json({ message: await translate("SUCCESSFUL", req.params.lang) });
  }

});

router.post("/userInfo/:userId/:lang", auth, checkDate, async (req, res) => {
  let usr = await user.findByPk(req.params.userId);
  if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

  let userOption, existDate;

  for (const element2 of req.body.deleted) {
    if (element2.hasValue == 0) {
      await user_tracking_option.destroy({
        where: {
          user_id: req.params.userId,
          date: req.body.date,
          tracking_option_id: element2.trackingOptionId
        }
      })
    }
    else if (element2.hasValue == 1) {
      await user_tracking_category.destroy({
        where: {
          user_id: req.params.userId,
          date: req.body.date,
          tracking_category_id: element2.categoryId
        }
      })
    }
  }

  for (const element of req.body.selected) {
    console.log("hasM", element.hasMultipleChoice)
    if (element.hasMultipleChoice == 0) {
      existDate = await user_tracking_option.findOne({
        where: {
          user_id: req.params.userId,
          date: req.body.date
        }
      })
      console.log("okkkkkkk");
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
        console.log("existData", existDate)
        if (await existData != null) {
          await existData.destroy();
        }

      }
    }

    try {
      let trackingOption = await health_tracking_option.findByPk(element.trackingOptionId);
      userOption = await user_tracking_option.create({
        date: req.body.date
      });
      if (userOption != null) {
        await userOption.setHealth_tracking_option(trackingOption).catch(async function (err) {
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

  for (const element3 of req.body.withValue) {
    existDate = await user_tracking_category.findOne({
      where: {
        user_id: req.params.userId,
        date: req.body.date,
        tracking_category_id: element3.categoryId
      }
    })
    if (existDate != null) {
      await existDate.update({ value: element3.value });
    }
    else {
      try {
        let trackingCategory = await health_tracking_category.findByPk(element3.categoryId);
        userCategory = await user_tracking_category.create({
          date: req.body.date,
          value: element3.value
        });
        if (userCategory != null) {
          await userCategory.setHealth_tracking_category(trackingCategory).catch(async function (err) {
            let result = await handleError(userCategory, err);
            if (!result) error = 1;
            return;
          })
          await userCategory.setUser(usr).catch(async function (err) {
            let result2 = await handleError(userCategory, err);
            if (!result2) error = 1;
            return;
          })
        }
      } catch (err) {
        let result3 = await handleError(userCategory, err);
        if (!result3) error = 1;
        return;
      }
    }
  }
  return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
});

module.exports = router;
