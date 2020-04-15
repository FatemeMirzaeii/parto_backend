const express = require("express");
const Joi = require("joi");
const Article = require("../models/Article");
const router = express();

//Article
router.get("/getArticleContent/:articleId", (req, res) => {
  const schema = {
    articleId: Joi.number().positive().integer().required(),
  };
  const result = Joi.validate(req.params, schema);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  Article.findAll({
    where: {
      id: req.params.articleId,
    },
  }).then((article) => {
    res.send(article.content);
  });
});

router.get("/getArticleHeader/:articleId", (req, res) => {
  res.send("This is article header");
});

router.get("/getArticlesList/:categoryId", (req, res) => {
  res.send(["article1", "article2", "article3"]);
});

module.exports = router;
