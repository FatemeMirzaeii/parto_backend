const express = require("express");
const auth = require("../middleware/auth");
const HealthTrackingOption = require("../models/HealthTrackingOption");
const HealthTrackingCategory = require("../models/HealthTrackingCategory");
const UserTrackingOption = require("../models/UserTrackingOption");
const UserLog = require("../models/UserLog");
const router = express();

router.post("/setUserHealthTrackingInfo", auth, (req, res) => {
  req.body.options.forEach((element) => {
    UserTrackingOption.create(element).then((g) => {
      res.send(g);
    });
  });
});

router.get("/getUserHealthTrackingInfo/:userId/:date", auth, (req, res) => {
  HealthTrackingCategory.findByPK(1);
  HealthTrackingOption.findByPK(1);
  UserLog.findByPK(1);
  UserTrackingOption.findAll({
    where: {
      user_id: req.params.userId,
      date: req.params.date,
    },
  }).then((tp) => {
    res.send(tp);
  });
});

module.exports = router;
