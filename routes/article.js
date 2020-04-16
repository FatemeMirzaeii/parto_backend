const express = require("express");
const Joi = require("joi");
const Article = require("../models/Article");
const router = express();

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

router.get("/getArticleTitle/:articleId", (req, res) => {
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
    res.send(article.title);
  });
});

router.get("/getArticlesList/:categoryId", (req, res) => {
  const schema = {
    categoryId: Joi.number().positive().integer().required(),
  };
  const result = Joi.validate(req.params, schema);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  var list;
  Article.findAll({
    where: {
      category_id: req.params.categoryId,
    },
  }).then((article) => {
    list.add(article);
  });
  res.send(list);
});

module.exports = router;
