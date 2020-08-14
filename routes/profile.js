const express = require("express");
const router = express();
const auth = require("../middleware/auth");
const { user_profile }= require("../models");
const translate = require("../config/translate");

router.get("/profile/:userId/:lang",auth, async(req, res) => {
    const u_profile = await user_profile.findOne({
      where: {
        user_id: req.params.userId,
      },
    });
    if(u_profile==null) return res.status(400).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
    res.status(200).json({data:u_profile});
  });