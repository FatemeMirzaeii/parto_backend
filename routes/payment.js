const express = require("express");
const router = express();
const { user, transaction, bank_receipt, invoice, service, wallet } = require("../models");
const auth = require("../middleware/auth");
const translate = require("../config/translate");
const config = require('../middleware/IDPay_config');
const handleError = require("../middleware/handleMysqlError");
const request = require("request-promise");
const logger = require("../config/logger/logger");

async function createInvoice(tService, tUser, method) {
    let inv = await invoice.create({
        method: method,
        status: 'wating to pay'
    });
    await inv.setService(tService);
    await inv.setUser(tUser);
    return await inv;
}
async function bankPayment(amount, tUser, tInvoice, gateway) {
    let options = {
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
            'callback': 'https://test.parto.app/payment/callback', // 'https://example.com/callback',
        },
        json: true,
    };
    let tBank = await bank_receipt.create({
        order_id: (tUser.id + tInvoice.id).toString(),
        gateway: gateway
    });
    let result
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
                meta_data: JSON.stringify(result.amount)
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
    if (credit != null && credit.remaining > amount) { return true; }
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
async function decreaseWallet(tWallet, tService) {
    if (tService.id == 1 || tService.id == 2) {
        await tWallet.update({ remaining: tWallet.remaining - tService.amount });
    }
}
async function increaseWallet(tWallet, tService) {
    await tWallet.update({ remaining: tWallet.remaining + tService.amount });
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
router.post("/v1/purchase/:userId/:lang", auth, async (req, res) => {

    let usr = await user.findByPk(req.params.userId);
    if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    let serv = await service.findByPk(req.body.serviceId);
    if (serv == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    if (req.body.method == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });

    let wall = await createWallet(usr);
    let inv = await createInvoice(serv, usr, req.body.method);

    let amount = serv.amount;
    let discount = 0;
    if (req.body.discount != null || req.body.discount != undefined) {
        amount = serv.amount - (serv.amount * (req.body.discount / 100));
        discount = req.body.discount;
    }

    if (req.body.method == 'gateway') {
        let tBank = await bankPayment(amount, usr, inv, 'ID_pay');
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
})

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
router.post("/v1/verifyPurchase/:userId/:lang", auth, async (req, res) => {

    let usr = await user.findByPk(req.params.userId);
    if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    if (req.body.authority == null || req.body.orderId == null || req.body.status == null) {
        return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    }
    let tBank =await bank_receipt.findOne({
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
            tBank = await bankVerify(req.body.authority, req.body.orderId);

            if (tBank.status == "Success") {
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

    let services = await service.findAll({
        attributes: ['id', 'name', 'amount']
    });

    return res.status(200).json({ data: { services } })
})

router.get("/v1/accountHistory/:userId/:lang", auth, async (req, res) => {

    let usr = await user.findByPk(req.params.userId);
    if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    let accountHistory = await ledger.findAll({
        include: [
            {
                model: service,
                required: true,
                attributes: ['id', 'service']
            }
        ],
        where: {
            user_id: req.params.userId,
        }
    })

    if (accountHistory == NULL) {

    }
    return res.status(200).json({ data: { error: response.data.errors } })
})
module.exports = router;
