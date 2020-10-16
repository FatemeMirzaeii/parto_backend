const axios = require("axios");
const BASE_URL = `https://api.kavenegar.com/v1/6D58546F68663949326476336B636A354F39542B474B47456D564A68504361377154414D78446D637263383D/verify`
module.exports = {
    getCompatibility: (receptor,token,template,token2) => axios({
        method:"GET",
        url : BASE_URL + `/lookup.json?`,
        
        params: {
            receptor:receptor,
            token:token,
            token2:token2,
            template:template
        }
    })
}