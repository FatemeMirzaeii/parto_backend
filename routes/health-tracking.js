const express = require("express");
const auth = require("../middleware/auth");
const {
  HealthTrackingOption,
  HealthTrackingCategory,
  UserTrackingOption } = require("../models");
const router = express();

router.get("/getCategories", auth, async (req, res) => {
  const categories = await HealthTrackingCategory.findAll();
  res.status(200).json({ data: categories });
});

router.post("/addCategory", auth, async (req, res) => {
  const exists = await HealthTrackingCategory.findOne({
    where: {
      title: req.body.title
    }
  });
  if (exists) return res.status(400).json({ message: "این دسته از قبل موجود است." });
  const cat = await HealthTrackingCategory.create({
    title: req.body.title
  });
  res.status(200).json({ data: { id: cat.id, title: cat.title } });
});

router.put("/editCategory/:id", auth, async (req, res) => {
  const exists = await HealthTrackingCategory.findByPk(req.params.id);
  if (!exists) return res.status(404).json({ message: "چنین دسته ای موجود نیست." });
  await HealthTrackingCategory.update({
    title: req.body.title
  },
    {
      returning: true,
      where: {
        id: req.params.id
      }
    });
  res.status(200);
});

router.delete("/deleteCategory/:id", auth, async (req, res) => {
  const exists = await HealthTrackingCategory.findByPk(req.params.id);
  if (!exists) return res.status(404).json({ message: "چنین دسته ای موجود نیست." });
  await HealthTrackingCategory.destroy({
    where: {
      id: req.params.id
    }
  });
  res.status(200);
});

router.post("/setUserInfo", auth, async (req, res) => {
  //todo: should check if an option doesnt exists anymore, then remove it.
  req.body.options.forEach(async (option) => {
    await UserTrackingOption.create({
      date: req.body.date,
      user_id: req.body.userId,
      health_tracking_option_id: option
    });
  });
  res.status(200);
});

router.get("/getUserInfo/:userId/:date", auth, async (req, res) => {
  const options = await UserTrackingOption.findAll({
    where: {
      user_id: req.params.userId,
      date: req.params.date,
    },
  })
  res.status(200).json({ data: { options: options } });
}
);

module.exports = router;
