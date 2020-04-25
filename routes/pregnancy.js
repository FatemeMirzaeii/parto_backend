const express = require("express");
const Pregnancy = require("../models/Pregnancy");
const auth = require("../middleware/auth");
const router = express();

//Pregnancy
router.get("/getWeekData/:userId/:date", auth, (req, res) => {
  Pregnancy.findByPk(1);
  res.send({
    weekNo: 24,
    startDate: 99 / 1 / 4,
    endDate: 99 / 1 / 11,
  });
});
router.get("/getWeekCount/:userId", auth, (req, res) => {
  res.send(24);
});
router.get("/getRemainingDaysToDelivery/:userId", auth, (req, res) => {
  res.send(100);
});
router.post("/setFetusInfo ", auth, (req, res) => {
  res.send(req.headers, req.params, req.body);
});
router.get("/getFetusInfo/:userId", auth, (req, res) => {
  res.send({
    size: 10,
    weight: "500g",
    age: "24weeks",
  });
});

module.exports = router;
