const express = require("express");
const router = express();
const { user, transaction, bank_receipt, invoice, service, wallet, discount_per_service } = require("../models");
const auth = require("../middleware/auth");
const translate = require("../config/translate");
const config = require('../middleware/IDPay_config');
const handleError = require("../middleware/handleMysqlError");
const request = require("request-promise");
const logger = require("../config/logger/logger");
const e = require("express");

async function calculateDiscount(serviceId, userId) {
    let dPerService = await discount_per_service.findOne({
        attributes: [`id`, `status`, `discount_type`, `discount_value`, `number_of_discount`, `start_time`, `end_time`],
        where: {
            service_id: serviceId
        }
    })
    // add discount_per_user and another fuecher
    if (dPerService.status == "Active")
        return { value: dPerService.discount_value, type: dPerService.discount_type };
}
async function createInvoice(tService, tUser, method) {
    let inv = await invoice.create({
        method: method,
        status: 'wating to pay'
    });
    await inv.setService(tService);
    await inv.setUser(tUser);
    return await inv;
}
async function bankPayment(amount, tUser, tInvoice, gateway, OS) {
    let options = {};
    if (OS == "android"){
        options = {
            method: 'POST',
            url: config.url,
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': config.key,
                'X-SANDBOX': 0
            },
            body: {
                'order_id': (tUser.id + tInvoice.id).toString(),
                'amount': amount,
                'callback': 'https://api.parto.app/payment/callback-app', 
            },
            json: true,
        };
    }
    else {
        options = {
            method: 'POST',
            url: config.url,
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': config.key,
                'X-SANDBOX': 0
            },
            body: {
                'order_id': (tUser.id + tInvoice.id).toString(),
                'amount': amount,
                'callback': 'https://api.parto.app/payment/callback', 
            },
            json: true,
        };
    }
    let tBank = await bank_receipt.create({
        order_id: (tUser.id + tInvoice.id).toString(),
        gateway: gateway
    });
    console.log("option", options);
    let result;
    try {
        result = await request(options);
        if (result.id) {
            await tBank.update({
                status: 'Waiting',
                authority: result.id,
                gateway_link: result.link
            })
        }
        else {
            logger.info("bank payment error", result);
            await tBank.update({ status: 'UnSuccess' })
        }
        await tBank.setInvoice(tInvoice);
    } catch (err) {
        logger.info("bank payment error", err);
        await tBank.update({ status: 'UnSuccess' })
        await tBank.setInvoice(tInvoice);

    }
    return await tBank;
}
async function bankVerify(authority, orderId) {

    let options = {
        method: 'POST',
        url: 'https://api.idpay.ir/v1.1/payment/verify',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': config.key,
            'X-SANDBOX': 0
        },
        body: {
            'id': authority,
            'order_id': orderId,
        },
        json: true,
    };
    let tBank = await bank_receipt.findOne({
        where: {
            authority: authority,
            order_id: orderId
        }
    })

    console.log("bank verify options", options.body);
    let result;
    try {

        result = await request(options);
        console.log("result", result)
        logger.info("bank result", result);
        if (result.status == 100) {
            await tBank.update({
                status: 'Success',
                meta_data: JSON.stringify(result)
            })
        }
        else {
            logger.info("bank verify payment- UnSuccess. result :", result);
            await tBank.update({ status: 'UnSuccess' });
        }

    } catch (err) {
        logger.info("bank verify payment error", err);
        await tBank.update({ status: 'UnSuccess' });
    }
    return await tBank;
}
async function checkWallet(tUser, amount) {
    let credit = await wallet.findOne({
        attributes: ['remaining'],
        where: {
            user_id: tUser.id
        }
    })
    if (credit != null && credit.remaining >= amount) { return true; }
    return false;
}
async function setTransaction(tWallet, tInvoice, method, amount, description) {
    let trans;
    if (method == "gateway") {
        trans = await transaction.create({
            amount: "+" + (amount).toString(),
            description: description
        });
    }
    else {
        trans = await transaction.create({
            amount: "-" + (amount).toString(),
            description: description
        });
    }
    await trans.setInvoice(tInvoice);
    await trans.setWallet(tWallet);
    return await trans;
}

async function updateInvoice(tInvoice, status) {
    await tInvoice.update({ status: status });

}
async function decreaseWallet(tWallet, amount) {
    await tWallet.update({ remaining: tWallet.remaining - amount });

}
async function increaseWallet(tWallet, tService) {
    await tWallet.update({ remaining: tWallet.remaining + tService.price });
}

async function createWallet(tUser) {
    let wall = await wallet.findOne({
        where: {
            user_id: tUser.id
        }
    })
    if (wall != null) return wall;

    wall = await wallet.create({ remaining: 0 });
    await wall.setUser(tUser);

    return wall;
}
async function checkBankInfo(authority, orderId) {
    let info = await bank_receipt.findOne({
        where: {
            authority: authority,
            order_id: orderId
        }
    })
    if (info != null) return true;
    return false;
}

router.post("/v1/purchase/:userId/:lang", auth, async (req, res) => {
    //Todo change discunt and add discinnt type and discunt value

    let usr = await user.findByPk(req.params.userId);
    if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    let serv = await service.findByPk(req.body.serviceId);
    if (serv == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    if (req.body.method == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

    let wall = await createWallet(usr);
    let inv = await createInvoice(serv, usr, req.body.method);
    // call calculateDiscount function 
    let amount = serv.price;
    let discount = 0;
    let dis = await calculateDiscount(req.body.serviceId, req.params.userId);
    console.log("heeeer",dis);
    if (dis!= undefined ) {
        if (dis.type  == "Percent") {
            amount = serv.price - (serv.price * (dis.value / 100));
        } else if (dis.type  == "Rials") {
            amount = serv.price - dis.value;
        }
        discount = dis.value;
    }
    console.log("heeeer",amount);
    if (req.body.method == 'gateway') {
        let OS = "PWA"
        if (req.body.appOS != undefined && req.body.appOS == "android") {
            OS = "android"
        }
        console.log("OS",OS);
        let tBank = await bankPayment(amount, usr, inv, 'ID_pay', OS);
        if (tBank.status == "Waiting") {
            await setTransaction(wall, inv, "gateway", amount, `discount:${discount}`);
            return res.status(200).json({ data: { link: tBank.gateway_link, authority: tBank.authority, orderId: tBank.order_id } });
        }
        else if (tBank.status == "UnSuccess") {
            await updateInvoice(inv, 'UnSuccess');
            return res.status(405).json({ message: "مشکلی در ایجاد تراکنش بوجود آمد" });//
        }
    }
    else if (req.body.method == 'wallet') {
        console.log("methodeeeeeeee wallet", await checkWallet(usr, amount));
        if (await checkWallet(usr, amount) == false) {
            await updateInvoice(inv, 'UnSuccess');
            return res.status(400).json({ message: "موجودی کافی نیست" });
        }
        else {
            await setTransaction(wall, inv, req.body.method, amount, "");
            await updateInvoice(inv, 'Success');
            await decreaseWallet(wall, amount);
            return res.status(200).json({ message: "خرید با موفقیت انجام شد " });
        }
    }
    else {
        return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    }
})

router.post("/v1/verifyPurchase/:userId/:lang", auth, async (req, res) => {

    let usr = await user.findByPk(req.params.userId);
    if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    if (req.body.authority == null || req.body.orderId == null || req.body.status == null) {
        return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    }
    let tBank = await bank_receipt.findOne({
        where: {
            authority: req.body.authority,
            order_id: req.body.orderId
        }
    });
    let wall = await wallet.findOne({ where: { user_id: req.params.userId } });
    let inv = await invoice.findByPk(tBank.invoiceId);
    let serv = await service.findByPk(await inv.serviceId);

    if (await checkBankInfo(req.body.authority, req.body.orderId) == true) {
        if (req.body.status == 10) {
            let tBankVerify = await bankVerify(req.body.authority, req.body.orderId);

            if (tBankVerify.status == "Success") {
                await updateInvoice(inv, 'Success');
                await increaseWallet(wall, serv);
                return res.status(200).json({ message: "پرداخت با موفقیت انجام شد " });
            }
            else {
                await updateInvoice(inv, 'UnSuccess');
                return res.status(400).json({ message: " پرداخت تایید و کامل نشد " });
            }

        }
        else if (req.body.status == 5 || req.body.status == 6) {
            await updateInvoice(inv, 'UnSuccess');
            await tBank.update({ status: 'Reversed' });
            return res.status(406).json({ message: " بازگشت به پرداخت کننده " });
        }
        else if (req.body.status == 7) {
            await updateInvoice(inv, 'UnSuccess');
            await tBank.update({ status: 'Cancel' });
            return res.status(406).json({ message: " انصراف از پرداخت " });
        }
        else if (req.body.status == 8) {
            await updateInvoice(inv, 'wating to pay');
            await tBank.update({ status: 'Waiting' });
            return res.status(406).json({ message: " به درگاه پرداخت منتقل شد " });
        }
        else if (req.body.status == 100 || req.body.status == 101 || req.body.status == 200) {
            await updateInvoice(inv, 'UnSuccess');
            await tBank.update({ status: 'Success' });
            return res.status(406).json({ message: " پرداخت قبلا با موفقیت انجام شده است " });
        }
        else {
            logger.info("calback status error", req.body.status);
            await updateInvoice(inv, 'UnSuccess');
            await tBank.update({ status: 'UnSuccess' });
            return res.status(406).json({ message: " پرداخت ناموفق " });
        }
    }
    else {
        return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    }

})

router.get("/v1/credit/:userId/:lang", auth, async (req, res) => {

    let usr = await user.findByPk(req.params.userId);
    if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    let accountCredit = await wallet.findOne({
        attributes: ['user_id', 'remaining'],
        where: {
            user_id: req.params.userId,
        }
    })
    if (accountCredit == null) {
        accountCredit = await createWallet(usr);
    }
    return res.status(200).json({ data: { remaining: accountCredit.remaining } })
})

router.get("/v1/services/:lang", async (req, res) => {

    let services = await discount_per_service.findAll({
        attributes: ['service_id', 'discount_value', 'discount_type', 'status'],
        include: [
            {
                model: service,
                required: true,
                attributes: ['id', 'name', 'price']

            }
        ]
    })
    let result = []
    services.forEach(element => {
        let temp = {};
        temp.id = element.service.id;
        temp.name = element.service.name;
        temp.price = element.service.price;

        if (element.status == 'Active') {
            temp.discountValue = element.discount_value;
            temp.discountType = element.discount_type;
        }
        result.push(temp);
    });

    return res.status(200).json({ data: { services: result } })
})

router.get("/v1/:userId/accountHistory/:lang", auth, async (req, res) => {

    let usr = await user.findByPk(req.params.userId);
    if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    let accountHistory = await transaction.findAll({

        include: [
            {
                model: invoice,
                required: true,
                where: {
                    user_id: req.params.userId,
                    status: "Success",
                },
                attributes: ['method', 'status', 'serviceId'],
                include: [
                    {
                        model: service,
                        required: true,
                        attributes: ['name']

                    }
                ],

            }
        ],

    })

    if (accountHistory.length == 0) {
        return res.status(404).json({ message: await translate("INFORMATIONNOTFOUND", req.params.lang) })
    }
    let list = [];
    for (i = 0; i < accountHistory.length; i++) {
        let temp = {};
        temp.amount = accountHistory[i].amount;
        temp.date = accountHistory[i].updatedAt;
        temp.method = accountHistory[i].invoice.method;
        temp.serviceName = accountHistory[i].invoice.service.name;
        temp.description = accountHistory[i].description;

        list.push(temp);
    }
    return res.status(200).json({ data: list })
})
router.get("/services/:serviceId/price/:lang", async (req, res) => {

    if (req.params.serviceId == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    let services = await service.findOne({
        attributes: ['price'],
        where: {
            id: req.params.serviceId
        }
    });
    if (services == null) {
        return res
            .status(404)
            .json(
                {
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
                data: { price: services.price },
                message: await translate("SUCCESSFUL", req.params.lang)
            });
})
module.exports = router;
