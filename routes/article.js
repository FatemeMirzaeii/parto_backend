const express = require("express");
const router = express();

//Article
router.get("/getArticleContent/:articleId", (req, res) => {
  res.send("This is article content");
});
router.get("/getArticleHeader/:articleId", (req, res) => {
  res.send("This is article header");
});
router.get("/getArticlesList/:categoryId", (req, res) => {
  res.send(["article1", "article2", "article3"]);
});

module.exports = router;
