const express = require("express");
const auth = require("../middleware/auth");
const { article, category } = require("../models");
const translate = require("../config/translate");
const router = express();

router.get("/getArticleContent/:lang/:articleId", auth, async (req, res) => {
  const art = await article.findByPk(req.params.articleId);
  if (!art) return res.status(404).json({ message: await translate("ARTICLENOTFOUND", req.params.lang) });
  res.status(200).json({ data: { content: art.content } });
});

router.get("/getArticleTitle/:lang/:articleId", auth, async (req, res) => {
  const art = await article.findByPk(req.params.articleId);
  if (!art) return res.status(404).json({ message: await translate("ARTICLENOTFOUND", req.params.lang) });
  res.status(200).json({ data: { title: art.title } });
});

router.get("/getArticlesList/:categoryId", async (req, res) => {
  category.findByPk(req.params.categoryId);
  const articles = await article.findAll({
    where: {
      category_id: req.params.categoryId,
    },
  })
  res.status(200).json({ data: { articles: articles } });
});

module.exports = router;
