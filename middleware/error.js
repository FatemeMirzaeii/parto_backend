const logger = require("../config/logger/logger");

module.exports = (err, req, res, next) => {
  logger.error(err.message, err);
  req.status=500;
  res.status(500).json({ message: err.message });
  
};
