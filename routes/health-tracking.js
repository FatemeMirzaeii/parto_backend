const express = require("express");
const Health_Tracking_Option = require("../models/Health_Tracking_Options");
const router = express();

//Health Tracking
router.post("/setUserHealthTrackingInfo ", (req, res) => {
  Health_Tracking_Option.findByPk(1);
  res.send(req.headers, req.params, req.body);
});
router.get("/getUserHealthTrackingInfo/:userId/:date ", (req, res) => {
  res.send([{ option1: 1, option2: 2 }]);
});

module.exports = router;
