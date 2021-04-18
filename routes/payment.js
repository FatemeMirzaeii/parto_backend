const express = require("express");
const router = express();
const { user ,transaction, ledger, credit,service} = require("../models");
const auth = require("../middleware/auth");
const translate = require("../config/translate");
const axios=require('axios')
const config = require('../middleware/zarinpal_config');

router.post("/v1/payment/:userId/:lang", auth, async (req, res) => {

    let usr = await user.findByPk(req.params.userId);
    if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    if(req.body.amount==null) return res.status(400).json({ message: " مبلغ وارد نشده" });
    if(req.body.callback_url==null)  return res.status(400).json({ message: "ادرس بازگشت وارد نشده است" });
    if(req.body.description==null)  return res.status(400).json({ message: "اتوضیحات وارد نشده است" });
    let parametr = {
        merchant_id: config.merchant,
        amount: req.body.amount,
        callback_url: req.body.callback_url,
        description: req.body.description,
        email: req.body.email,
        mobile: req.body.mobile
    };
    
    axios.post(config.https+config.API.PR,parametr)
      .then(async function (response) {
        console.log(response);
        if(response.data.data.code===100&& response.data.data.authority!=null){
            return res.status(200).json({data:{location: "https://www.zarinpal.com/pg/StartPay/"+ response.data.data.authority ,
            authority:response.data.data.authority }})
        }
        if(response.data.errors!=null){
            let e_code=response.data.errors.code;
            if(e_code==-9||e_code==-10||e_code==-33|| e_code==-40){
                return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
            }
            else if(e_code==-11||e_code==-15){
                return res.status(500).json({message:"مریچنت کد فعال نیست یا ترمینال به حالت تعلیق درآمده است با پشتیبانی زرین پال تماس بگیرید."})
            }
            else if(e_code==-12){
                return res.status(408).json({ message: await translate("TIMEOVER", req.params.lang) });
            }
            return res.status(400).json({data:{error: response.data.errors}})
        }
     })
      .catch(function (error) {
        console.log(error);
        return res.status(500).json({data:error})
    })
})

router.post("/v1/verify/:userId/:lang", auth, async (req, res) => {

    let usr = await user.findByPk(req.params.userId);
    if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    
    let parametr = {
        merchant_id: config.merchant,
        amount: req.body.amount,
        authority: req.body.authority,
        description:req.body.description
    };
    
    axios.post(config.https+config.API.PV,parametr)
      .then(async function (response) {
        console.log(response);
        if(response.data.data.code===100){
            let zp_res=response.data.data;
            //add transaction
            let tran=await transaction.create({amount:req.body.amount,description:req.body.description,card_pan:zp_res.card_pan,card_hash:zp_res.card_hash,
                transaction_number:zp_res.ref_id,transaction_type:'Debtor'});
                await tran.setUser(usr).catch(async function (err) {
                    let result2 = await handleError(tran, err);
                    if (!result2) error = 1;
                    return;
                })
                // increse user creadit
                let userCredit=await credit.findOne({
                    where:{
                        user_id:req.params.userId
                    }
                })
                if(userCredit==null){
                    userCredit=await credit.create({remaining:req.body.amount});
                    await userCredit.setUser(usr).catch(async function (err) {
                        let result2 = await handleError(userCredit, err);
                        if (!result2) error = 1;
                        return;
                    })
                }
                else{
                    userCredit.update({remaining:userCredit.remaining+req.body.amount});
                }
                // add to ledger with fix services id 
                let addLedger=await ledger.creare({
                    description:req.body.description,
                    transaction_type:'Debtor'
                })
                await addLedger.setUser(usr).catch(async function (err) {
                    let result = await handleError(addLedger, err);
                    if (!result) error = 1;
                    return;
                })
                await addLedger.setService(await service.findByPk(1)).catch(async function (err) {
                    let result2 = await handleError(addLedger, err);
                    if (!result2) error = 1;
                    return;
                })
                
            return res.status(200).json({data:{transaction_number:zp_res.ref_id}});
        }
        if(response.data.data.code===101){
            // search in transaction table that have transaction with this ref_id
            return res.status(400).json({ message: "تراکنش تکراری است"});
        }
        if(response.data.errors!=null){
            let e_code=response.data.errors.code;
            if(e_code==-9||e_code==-10||e_code==-54|| e_code==-53 ){
                return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
            }
            else if(e_code==-52){
                return res.status(500).json({message:"خطای غیر منتظره با پشتیبانی زرین پال تماس بگیرید"})
            }
            else if(e_code==-51){
                return res.status(400).json({ message: "پرداخت ناموفق " });
            }
            else if(e_code==-50){
                return res.status(409).json({ message: "مبلغ پرداخت شده با مقدار مبلغ در وریفای متفاوت است" });
            }
            return res.status(400).json({data:{error: response.data.errors}})
        }
     })
      .catch(function (error) {
        console.log(error);
        return res.status(500).json({data:error})
    })
})

router.get("/v1/accountCredit/:userId/:lang", auth, async (req, res) => {

    let usr = await user.findByPk(req.params.userId);
    if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    let accountCredit=await credit.findOne({
        attributes: ['user_id','remaining'],
        where: {
            user_id: req.params.userId,
        }
    })
    if(accountCredit==0){

    }
    return res.status(200).json({data:{accountCredit}})
})

router.get("/v1/accountHistory/:userId/:lang", auth, async (req, res) => {

    let usr = await user.findByPk(req.params.userId);
    if (usr == null) return res.status(400).json({ message: await translate("INVALIDENTRY", req.params.lang) });
    let accountHistory=await ledger.findAll({
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

    if(accountHistory==NULL){

    }
    return res.status(200).json({data:{error: response.data.errors}})
})
module.exports = router;
