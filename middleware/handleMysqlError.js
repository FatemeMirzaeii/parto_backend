const logger = require("../config/logger/logger");
module.exports = async function handleError(query, err) {
    if (err.errors[0] && query != null ) {
        console.log("ERRRRRRRRR",err);
        logger.info("DUPLICATRE ENTERY-"+err.errors[0].message);
        let result= await query.destroy();
       
    }
    
}