const logger = require("../config/logger");

module.exports = (err, req, res, next) => {
  logger.error(err.message, err);
  res.status(500).json({ message: err.message });
};
