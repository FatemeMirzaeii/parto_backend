const logger = require("../config/logger/logger");
async function handleError(query, err) {
    
    if (err.errors[0] && query != null ) {
        // logger.info("DUPLICATRE ENTERY-"+err.errors[0].message);
        let result;
        result=await query.destroy();
        if(result){return true;} 
        else{return false;}   
    }
    if(err.errors[0].type=="Validation error"){
        logger.info("Validation error-"+err.errors[0].message+"-Instance:"+err.errors[0].instance+"-value:"+err.errors[0].value);
        return true;
    }
    
}
module.exports=handleError;