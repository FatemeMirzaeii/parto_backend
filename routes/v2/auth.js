const express = require("express");
const { user, verification_code } = require("../../models");
const router = express.Router();
const translate = require("../../config/translate");
const sendEmail = require("../../middleware/sendEmail");
const auth = require("../../middleware/auth");
const Kavenegar = require('kavenegar');
const useragent = require('useragent');
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

function checkPhone(phone) {
    const regex = RegExp(/^(\98)9(0|1|2|3|9)\d{8}$/g);
    return regex.test(phone);
}
function checkEmail(email) {
    const regex = RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,3})$/);
    return regex.test(email);
}
async function checkUserWithPhone(phone) {
    let userExist = await user.findOne({
        where: {
            phone: phone
        }
    })
    if (await userExist == null) return null;
    else return userExist;
}
async function checkUserWithEmail(email, pass) {
    let userExist = await user.findOne({
        where: {
            email: email,
            password: pass
        }
    })
    if (userExist == null) return null;
    // const checkPass = await bcrypt.compare(pass, userExist.pass);
    // if (!checkPass) return null;
    return userExist;
}

async function sendSms(type, phone, code, template) {

    let api = Kavenegar.KavenegarApi({
        apikey: '6D58546F68663949326476336B636A354F39542B474B47456D564A68504361377154414D78446D637263383D'
    });
    return new Promise((resolve, reject) => {
        api.VerifyLookup({
            receptor: phone,
            token: code.toString(),
            template: template,
        },
            async (response, status, message) => {

                if (status == 418) {
                    await sendEmail('parto@parto.email', 'Parvanebanoo.parto@gmail.com', message, "ارور سامانه پیامکی- بک اند ");
                    await sendEmail('parto@parto.email', 'H.Aghashahi @parto.email', message, "ارور سامانه پیامکی- بک اند ");
                }
                resolve(status);
            })
    })
}

async function getCreateTime(userExist) {
    let createDate = new Date(userExist[userExist.length - 1].createdAt);
    let milliseconds = Date.parse(createDate);
    milliseconds = milliseconds - (((4 * 60) + 30) * 60 * 1000);
    return new Date() - new Date(milliseconds);
}


router.post("/verificationCode/:lang", async (req, res) => {
    if ((req.body.phone == "" || req.body.phone == null) && (req.body.email == "" || req.body.email == null)) {
        return res
            .status(400)
            .json({
                status: "error",
                data: null,
                message: await translate("INVALIDENTRY", req.params.lang)
            });
    }
    let flag = true;
    let code = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
    let type = "login";
    if (req.body.type != undefined && req.body.type == "lock") {
        code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
        type = "lock";
    }

    let userExist;
    let time;
    if (req.body.phone != null && req.body.phone != "") {
        time = (2 * 60 * 1000);
        if (!checkPhone(req.body.phone))
            return res
                .status(400)
                .json({
                    status: "error",
                    data: null,
                    message: await translate("INVALIDENTRY", req.params.lang)
                });
        userExist = await verification_code.findAll({
            where: {
                phone: req.body.phone,
                type: type
            }
        });
    }
    else {
        time = (10 * 60 * 1000);
        if (!checkEmail(req.body.email))
            return res
                .status(400)
                .json({
                    status: "error",
                    data: null,
                    message: await translate("INVALIDENTRY", req.params.lang)
                });
        userExist = await verification_code.findAll({
            where: {
                email: req.body.email,
                type: type
            }
        });
    }
    console.log("exist", userExist);
    if (userExist.length > 0) {
        if (await getCreateTime(userExist) < time) {

            flag = false;
            return res
                .status(409)
                .json({
                    status: "error",
                    data: null,
                    message: "دقیقه دوباره درخواست دهید " + time / 60000 + "لطفا پس از"
                });
        }
        else if (await getCreateTime(userExist) > time) {
            for (const element of userExist) {
                await element.destroy();
            }
            flag = true;
        }
    }

    if (flag == true) {

        let template = "verificationCode";
        if (type == "lock") template = "lockCode";
        let result;
        // send Email
        if (req.body.phone != null) {
            result = await sendSms(type, req.body.phone, code, template);
            if (result == 200) {
                await verification_code.create({
                    phone: req.body.phone,
                    code: code,
                    type: type
                })
            }
        }
        else {
            let subject = ` Parto- ${template}  `;
            let text = `کد فعالسازی شما : ${code}  `;
            result = await sendEmail('parto@parto.email', req.body.email, text, subject);

            await verification_code.create({
                email: req.body.email,
                code: code,
                type: type
            })

        }
        console.log("resultttttttttt", result);
        if (result == 200) {
            return res
                .status(200)
                .json({
                    status: "success",
                    data: null,
                    message: await translate("SUCCESSFUL", req.params.lang)
                });
        }
        else return res
            .status(502)
            .json({
                status: "error",
                data: null,
                message: await translate("SERVERERROR", req.params.lang)
            });
    }

});

router.post("/checkVerificationCode/:lang", async (req, res) => {
    if (req.body.code == "" || req.body.code == null ||
        ((req.body.phone == "" || req.body.phone == null) && (req.body.email == "" || req.body.email == null))) {
        return res
            .status(400)
            .json({
                status: "error",
                data: null,
                message: await translate("INVALIDENTRY", req.params.lang)
            });
    }
    let type = "login";
    if (req.body.type != undefined && req.body.type == "lock") {
        type = "lock";
    }

    let userExist;
    let time;
    if (req.body.phone != null && req.body.phone != "" ) {
        time = (2 * 60 * 1000);
        userExist = await verification_code.findAll({
            where: {
                phone: req.body.phone,
                type: type
            }
        });
    }
    else {
        time = (10 * 60 * 1000);
        userExist = await verification_code.findAll({
            where: {
                email: req.body.email,
                type: type
            }
        });
    }

    if (userExist.length == 0) {
        return res
            .status(404)
            .json({
                status: "error",
                data: null,
                message: await translate("INFORMATIONNOTFOUND", req.params.lang)
            });
    }
    else {
        if (await getCreateTime(userExist) > time) {
            console.log("time expier");
            return res
                .status(408)
                .json({
                    status: "error",
                    data: null,
                    message: await translate("TIMEOVER", req.params.lang)
                });
        }
        else {
            console.log("code", userExist[userExist.length - 1].code)
            if (userExist[userExist.length - 1].code != req.body.code) {
                return res
                    .status(400)
                    .json({
                        status: "error",
                        data: null,
                        message: await translate("INVALIDCODE", req.params.lang)
                    });
            }
            for (const element of userExist) {
                await element.destroy();
            }
        }
    }
    return res
        .status(200)
        .json({
            status: "success",
            data: null,
            message: await translate("SUCCESSFUL", req.params.lang)
        });
});

module.exports = router;