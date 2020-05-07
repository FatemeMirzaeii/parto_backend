const express = require("express");
const auth = require("../middleware/auth");
const Article = require("../models/Article");
const category = require("../models/Category");
const router = express();

router.get("/getArticleContent/:articleId", auth, async (req, res) => {
  const article = await Article.findByPk(req.params.articleId);
  if (!article) return res.status(404).json({ message: "مقاله مورد نظر یافت نشد." });
  res.status(200).json({ data: { content: article.content } });
});

router.get("/getArticleTitle/:articleId", auth, async (req, res) => {
  const article = await Article.findByPk(req.params.articleId);
  if (!article) return res.status(404).json({ message: "مقاله مورد نظر یافت نشد." });
  res.status(200).json({ data: { title: article.title } });
});

router.get("/getArticlesList/:categoryId", async (req, res) => {
  category.findByPk(req.params.categoryId);
  const articles = await Article.findAll({
    where: {
      category_id: req.params.categoryId,
    },
  })
  res.status(200).json({ data: { articles: articles } });
});

module.exports = router;
