const express = require("express");
const router = express();

//interview
router.get("/getInterviewQuestion/:questionId", (req, res) => {
  res.send("Question2");
});

router.post("/setInterviewAnswer", (req, res) => {
  res.send(req.headers, req.params, req.body);
});

module.exports = router;
