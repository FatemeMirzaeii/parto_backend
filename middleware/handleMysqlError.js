const logger = require("../config/logger/logger");
async function handleError(query, err) {
    console.log("ERRRRRRRRR",err.errors[0]);
    if (err.errors[0] && query != null ) {
        console.log("ERRRRRRRRR",err);
        logger.info("DUPLICATRE ENTERY-"+err.errors[0].message);
        let result;
        result=await query.destroy();
        if(result){logger.info("DESTROY ROW SUCCESSFUL",result);return true;} 
        else{logger.info("DESTROY ROW FAILED",result);return false;}   
    }
    if(err.errors[0].type=="Validation error"){
        logger.info("Validation error-"+err.errors[0].message+"-Instance:"+err.errors[0].instance+"-value:"+err.errors[0].value);
        return true;
    }
    
}
module.exports=handleError;