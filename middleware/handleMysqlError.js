const logger = require("../config/logger/logger");
module.exports = async function handleError(query, err) {
    if (err.errors[0] && query != null) {
        logger.info(err.errors[0].message);
        await query.destroy();
    }
    else {
        if (err.errors[0].message == 'user_tracking_option_user_id_tracking_option_id_date must be unique') {
            logger.info("ER_DUP_ENTRY -user_tracking_option_user_id_tracking_option_id_date must be unique");
            await query.destroy();
        }

        if (err.original.code == 'ER_DUP_ENTRY') {
            logger.info("ER_DUP_ENTRY");
            await query.destroy();
        }
    }
}