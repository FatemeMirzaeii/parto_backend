
const translate = require("../config/translate");

 async function checkDate(req, res,next){
    let ts = Date.now();
    let date_ob = new Date(ts);
    let nowDay = date_ob.getDate();
    let nowMonth = date_ob.getMonth() + 1;
    let nowYear = date_ob.getFullYear();
    let reqDate;
    if(req.body.date==undefined){
        reqDate= req.params.date.split("-");
    }
    else if(req.params.date==undefined){  
        reqDate= req.body.date.split("-");
    }
    //console.log(nowYear, " ", nowMonth, " ",nowDay);
    if(nowYear<reqDate[0]){
        return res.status(400).json({ message: await translate("INVALIDDATE", req.params.lang) });
    }
    if(nowYear==reqDate[0] && nowMonth<reqDate[1]){
        return res.status(400).json({ message: await translate("INVALIDDATE", req.params.lang) });
    }
    if(nowYear==reqDate[0] && nowMonth==reqDate[1]&&nowDay<reqDate[2]){
        return res.status(400).json({ message: await translate("INVALIDDATE", req.params.lang) });
    }
    return next();
}
module.exports=checkDate;