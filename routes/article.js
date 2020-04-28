const express = require("express");
const auth = require("../middleware/auth");
const Article = require("../models/Article");
const category = require("../models/Category");
const router = express();

router.get("/getArticleContent/:articleId", auth, (req, res) => {
  Article.findByPk(req.params.articleId).then((article) => {
    if (!article) return res.status(404).send("مقاله مورد نظر یافت نشد.");
    res.send(article.content);
  });
});

router.get("/getArticleTitle/:articleId", auth, (req, res) => {
  Article.findByPk(req.params.articleId).then((article) => {
    if (!article) return res.status(404).send("مقاله مورد نظر یافت نشد.");
    res.send(article.title);
  });
});

router.get("/getArticlesList/:categoryId", (req, res) => {
  category.findByPk(req.params.categoryId);
  Article.findAll({
    where: {
      category_id: req.params.categoryId,
    },
  }).then((articles) => {
    res.send(articles);
  });
});

module.exports = router;
