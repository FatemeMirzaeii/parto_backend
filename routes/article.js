const express = require("express");
const auth = require("../middleware/auth");
const { article } = require("../models");
//const category = require("../models/Category");
const router = express();

router.get("/getArticleContent/:articleId", auth, async (req, res) => {
  const art = await article.findByPk(req.params.articleId);
  if (!art) return res.status(404).json({ message: "مقاله مورد نظر یافت نشد." });
  res.status(200).json({ data: { content: art.content } });
});

router.get("/getArticleTitle/:articleId", auth, async (req, res) => {
  const art = await article.findByPk(req.params.articleId);
  if (!art) return res.status(404).json({ message: "مقاله مورد نظر یافت نشد." });
  res.status(200).json({ data: { title: art.title } });
});

router.get("/getArticlesList/:categoryId", async (req, res) => {
  //   category.findByPk(req.params.categoryId);
  //   const articles = await Article.findAll({
  //     where: {
  //       category_id: req.params.categoryId,
  //     },
  //   })
  //   res.status(200).json({ data: { articles: articles } });
});

module.exports = router;
