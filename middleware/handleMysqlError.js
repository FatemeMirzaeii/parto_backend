const logger = require("../config/logger/logger");
module.exports = async function handleError(query,err){
    if(err.original.code=='ER_DUP_ENTRY'){
        logger.info("ER_DUP_ENTRY"+query);
        await query.destroy();
    }
}