const express = require("express");
const router = express();

//Health Tracking
router.post("/setUserHealthTrackingInfo ", (req, res) => {
  res.send(req.headers, req.params, req.body);
});
router.get("/getUserHealthTrackingInfo/:userId/:date ", (req, res) => {
  res.send([{ option1: 1, option2: 2 }]);
});

module.exports = router;
