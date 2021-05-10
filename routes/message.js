const express = require("express");
const { message_status , user,message_category , } = require("../models");
const auth = require("../middleware/auth");
const translate = require("../config/translate");
const router = express();


router.get("/v1/status/:userId/:messageStatusId/:lang", auth, async (req, res) => {
    let usr = await user.findByPk(req.params.userId);
    if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    let sta = await message_status.findByPk(req.params.messageStatusId);
    if (sta == null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
    return res.status(200).json({ data: { status: sta.status } });

});

router.get("/v1/messageCategory/:lang", async (req, res) => {
    let cat = await message_category.findAll({});
    if (cat == null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
    return res.status(200).json({ data: { categoryId: cat.id,name:cat.name} });

});

router.get("/v1/messageStatusId/:userId/:categoryId/:lang", auth, async (req, res) => {
    let usr = await user.findByPk(req.params.userId);
    if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    let cat = await message_category.findByPk(req.params.categoryId);
    // console.log("categoryyyy",category);
    if (cat == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    console.log("categoryyyy");
    let uId = await message_status.findOne({
        where: {
            user_id: req.params.userId,
            category_id: req.params.categoryId
        }
    })
    console.log("uId",uId);
    if (uId == null) {
        uId = await message_status.create({
            status: 0
        })
        uId.setUser(usr);
        uId.setMessageCategory(cat);
    }
    return res.status(200).json({ data: { messageStatusId: uId.id } });

});

router.post("/v1/status/:userId/:messageStatusId/:lang", auth, async (req, res) => {
    let usr = await user.findByPk(req.params.userId);
    if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    if (req.body.status == null || req.params.messageStatusId==null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    let sta = await message_status.findByPk(req.params.messageStatusId);
    if (sta == null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
    await sta.update({status:req.body.status});
    return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });

});

module.exports = router;