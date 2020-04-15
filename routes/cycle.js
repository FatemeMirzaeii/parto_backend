const express = require("express");
const router = express.Router();

//cycle
router.post("/addNewCycle", (req, res) => {
  res.send(req.headers, req.params, req.body);
});

router.put("/editCycle/:cycleId", (req, res) => {
  res.send(req.headers, req.params, req.body);
});

router.delete("/deleteCycle/:cycleId", (req, res) => {
  res.send(req.headers, req.params, req.body);
});

router.get("/getCyclePeriodDays/:cycleId", (req, res) => {
  var params = req.params;
  res.send(params.cycleId);
//  res.send(["99/1/7", "99/1/8", "99/1/9", "99/1/10"]);
});

router.get("/getCycleFertilityDays/:cycleId", (req, res) => {
  res.send(["99/1/15", "99/1/16", "99/1/17", "99/1/18"]);
});

router.post("/addPeriodDay", (req, res) => {
  res.send(req.headers, req.params, req.body);
});

router.delete("/deletePeriodDay/:cycleId/:date", (req, res) => {
  res.send(req.headers, req.params, req.body);
});

router.get("/getCyclesHistory/:userId", (req, res) => {
  res.send("This is your history");
});

router.get("/getCycleAnalysis/:userId", (req, res) => {
  res.send("cycle analysis");
});

router.get("/getCycleForecast/:userId", (req, res) => {
  res.send(["..."]);
});

router.get("/getCycleIdFromDate/:userId/:date", (req, res) => {
  res.send(12);
});

router.get("/getNote/:userId/:date", (req, res) => {
  res.send("Hey it's my first note in parto!");
});

router.post("/setNote", (req, res) => {
  res.send(req.headers, req.params, req.body);
});

module.exports = router;
