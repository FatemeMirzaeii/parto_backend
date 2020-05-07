const express = require("express");
const auth = require("../middleware/auth");
const HealthTrackingOption = require("../models/HealthTrackingOption");
const HealthTrackingCategory = require("../models/HealthTrackingCategory");
const UserTrackingOption = require("../models/UserTrackingOption");
const UserLog = require("../models/UserLog");
const router = express();

router.post("/setUserHealthTrackingInfo", auth, async (req, res) => {
  req.body.options.forEach(async (option) => {
    await UserTrackingOption.create(option);
  });
  res.status(200);
});

router.get("/getUserHealthTrackingInfo/:userId/:date", auth,
  async (req, res) => {
    HealthTrackingCategory.findByPK(1);
    HealthTrackingOption.findByPK(1);
    UserLog.findByPK(1);
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
