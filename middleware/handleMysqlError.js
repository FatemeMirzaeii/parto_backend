const logger = require("../config/logger/logger");
async function handleError(query, err) {
    console
    if (err.errors[0] && query != null ) {
       // console.log("ERRRRRRRRR",err);
        logger.info("DUPLICATRE ENTERY-"+err.errors[0].message);
        let result;
        result=await query.destroy();
        if(result){console.log("ssssssssssssssssss",result);return true;} 
        else{console.log("eeeeeeeeeeeeeeee",result);return false;}   
    }
    
}
module.exports=handleError;