const logger = require("../config/logger/logger");
async function handleError(query, err) {
   
    if (err.errors[0] && query != null ) {
       // console.log("ERRRRRRRRR",err);
        logger.info("DUPLICATRE ENTERY-"+err.errors[0].message);
        let result;
        result=await query.destroy();
        if(result){logger.info("DESTROY ROW SUCCESSFUL",result);return true;} 
        else{logger.info("DESTROY ROW FAILED",result);return false;}   
    }
    
}
module.exports=handleError;