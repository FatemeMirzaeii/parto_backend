const express = require("express");
const auth = require("../middleware/auth");
const {
  health_tracking_option,
  health_tracking_category,
  user_tracking_option } = require("../models");
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

router.post("/setUserInfo", auth, async (req, res) => {
  //todo: should check if an option doesnt exists anymore, then remove it.
  req.body.options.forEach(async (option) => {
    await user_tracking_option.create({
      date: req.body.date,
      user_id: req.body.userId,
      health_tracking_option_id: option
    });
  });
  res.status(200);
});

router.get("/getUserInfo/:userId/:date", auth, async (req, res) => {
  const options = await user_tracking_option.findAll({
    where: {
      user_id: req.params.userId,
      date: req.params.date,
    },
  })
  res.status(200).json({ data: { options: options } });
}
);

module.exports = router;
