const express = require("express");
const { message_info, user, message_category, message } = require("../models");
const auth = require("../middleware/auth");
const translate = require("../config/translate");
const router = express();
const { Op } = require("sequelize");

router.get("/v1/info/:userId/:categoryId/:lang", auth, async (req, res) => {
    let usr = await user.findByPk(req.params.userId);
    if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    let sta = await message_info.findOne({
        where: {
            user_id: req.params.userId,
            category_id: req.params.categoryId
        }
    });
    if (sta == null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
    return res.status(200).json({ data: { status: sta.status, totalQuestion: sta.total_question } });

});
router.get("/v1/goftinoId/:userId/:lang", auth, async (req, res) => {
    let usr = await user.findByPk(req.params.userId);
    if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    let gId = await message_info.findAll({
        attributes: [['goftino_id', 'goftinoId'], ['category_id', 'categoryId']],
        where: {
            user_id: req.params.userId,
        }
    });
    if (gId.length == 0) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
    return res.status(200).json({ data: gId });

});
router.get("/messageInfo/:userId/:categoryId/goftinoId/:lang", auth, async (req, res) => {
    let usr = await user.findByPk(req.params.userId);
    if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    let gId = await message_info.findOne({
        attributes: ['goftino_id'],
        where: {
            user_id: req.params.userId,
            category_id: req.params.categoryId
        }
    });
    if (gId==null) {
        return res.status(404)
            .json({
                status: "error",
                data: {},
                message: await translate("INFORMATIONNOTFOUND", req.params.lang)
            });
    }
    return res
        .status(200)
        .json(
            {
                status: "success",
                data: { goftinoId: gId.goftino_id },
                message: await translate("SUCCESSFUL", req.params.lang)
            });
});

router.get("/v1/totalQuestion/:userId/:lang", auth, async (req, res) => {
    let usr = await user.findByPk(req.params.userId);
    if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    let totalQuestion = 0;
    let sta = await message_info.findAll({
        where: {
            user_id: req.params.userId,
        }
    });
    if (sta.length > 0) {
        for (j = 0; j < sta.length; j++) {
            totalQuestion = totalQuestion + sta[j].total_question
        }
    }
    return res.status(200).json({ data: { totalQuestion: totalQuestion } });

});

router.get("/v1/messageCategory/:lang", async (req, res) => {
    let cat = await message_category.findAll({
        attributes: [['id', 'categoryId'], 'name']
    });
    if (cat == null) return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) });
    return res.status(200).json({ data: cat });

});

router.post("/v1/goftinoId/:userId/:lang", auth, async (req, res) => {
    let usr = await user.findByPk(req.params.userId);
    if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    if (req.body.goftinoId == null || req.body.categoryId == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    let sta = await message_info.findOne({
        where: {
            user_id: req.params.userId,
            category_id: req.body.categoryId
        }
    });
    if (sta != null) await sta.update({ goftino_id: req.body.goftinoId });
    else {
        let category = await message_category.findByPk(req.body.categoryId);
        sta = await message_info.create(
            {
                goftino_id: req.body.goftinoId,
                status: false,
                total_question: 0
            });
        await sta.setUser(usr).catch(async function (err) {
            let result2 = await handleError(sta, err);
            if (!result2) error = 1;
            return;
        })
        await sta.setMessage_category(category).catch(async function (err) {
            let result2 = await handleError(sta, err);
            if (!result2) error = 1;
            return;
        })
    }
    return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
});

router.post("/v1/status/:userId/:lang", auth, async (req, res) => {
    let usr = await user.findByPk(req.params.userId);
    if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    if (req.body.status == null || req.body.categoryId == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    let sta = await message_info.findOne({
        where: {
            user_id: req.params.userId,
            category_id: req.body.categoryId
        }
    });
    if (sta != null) await sta.update({ status: req.body.status });
    else {
        let category = await message_category.findByPk(req.body.categoryId);
        sta = await message_info.create({ status: req.body.status });
        await sta.setUser(usr).catch(async function (err) {
            let result2 = await handleError(sta, err);
            if (!result2) error = 1;
            return;
        })
        await sta.setMessage_category(category).catch(async function (err) {
            let result2 = await handleError(sta, err);
            if (!result2) error = 1;
            return;
        })
    }
    return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
});
router.post("/v1/:userId/:lang", auth, async (req, res) => {
    let usr = await user.findByPk(req.params.userId);
    let category = await message_category.findByPk(req.body.categoryId);
    if (usr == null || category == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    if (req.body.senderId == null || req.body.receiverId == null || req.body.content == null || req.body.type == null) {
        return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) })
    };

    if ((req.body.senderId != usr.id && req.body.senderId != category.id) || (req.body.receiverId != usr.id && req.body.receiverId != category.id)) {
        return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) })
    }

    let m = await message.create({
        content: req.body.content,
        type: req.body.type,
        sender_id: req.body.senderId,
        receiver_id: req.body.receiverId,
    })
    let mInfo = {
        status: req.body.status,
        total_question: req.body.totalQuestion
    }
    let info = await message_info.findOne({
        where: {
            user_id: req.params.userId,
            category_id: req.body.categoryId
        }
    });
    if (info != null) await info.update(mInfo);
    else {
        info = await message_info.create(mInfo);
        await info.setUser(usr).catch(async function (err) {
            let result = await handleError(info, err);
            if (!result) error = 1;
            return;
        })
        await info.setMessage_category(category).catch(async function (err) {
            let result = await handleError(info, err);
            if (!result) error = 1;
            return;
        })
    }
    return res.status(200).json({ message: await translate("SUCCESSFUL", req.params.lang) });
})

router.get("/v1/:userId/:categoryId/:lang", auth, async (req, res) => {
    let usr = await user.findByPk(req.params.userId);
    let category = await message_category.findByPk(req.params.categoryId);
    if (usr == null || category == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

    let messages = await message.findAll({
        where: {
            [Op.or]: [
                {
                    [Op.and]: [
                        { receiver_id: req.params.userId },
                        { sender_id: req.params.categoryId }
                    ]
                },
                {
                    [Op.and]: [
                        { receiver_id: req.params.categoryId },
                        { sender_id: req.params.userId }
                    ]
                }
            ]
        }
    });
    if (messages.length == null) { messages = "" }
    else messages.sort(function (a, b) { return a.id - b.id });
    let sta = await message_info.findOne({
        where: {
            user_id: req.params.userId,
            category_id: req.params.categoryId
        }
    });
    let status, totalQuestion;
    if (sta == null) {
        status = false;
        totalQuestion = 0;
    }
    else {
        status = sta.status;
        totalQuestion = sta.total_question;
    }
    return res.status(200).json({ data: { status: status, totalQuestion: totalQuestion, messages: messages } });

})

module.exports = router;