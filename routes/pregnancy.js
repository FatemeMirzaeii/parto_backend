const express = require("express");
const router = express();

//Pregnancy
router.get("/getWeekData/:userId/:date", (req, res) => {
  res.send({
    weekNo: 24,
    startDate: 99 / 1 / 4,
    endDate: 99 / 1 / 11
  });
});
router.get("/getWeekCount/:userId", (req, res) => {
  res.send(24);
});
router.get("/getRemainingDaysToDelivery/:userId", (req, res) => {
  res.send(100);
});
router.post("/setFetusInfo ", (req, res) => {
  res.send(req.headers, req.params, req.body);
});
router.get("/getFetusInfo/:userId", (req, res) => {
  res.send({
    size: 10,
    weight: "500g",
    age: "24weeks"
  });
});

module.exports = router;
