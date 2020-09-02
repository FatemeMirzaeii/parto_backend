const express = require("express");
const router = express();
const auth = require("../middleware/auth");
const { user_profile }= require("../models");
const translate = require("../config/translate");

router.get("/:userId/:lang",auth, async(req, res) => {
  
    const uProfile = await user_profile.findOne({
      where: {
        user_id: req.params.userId,
      },
    });
    if(uProfile==null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
    res.status(200).json({data:uProfile});
  });

module.exports = router;