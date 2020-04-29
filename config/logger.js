const winston = require("winston");

winston.configure({
  transports: new winston.transports.File({
    filename: "error.log",
  }),
  exceptionHandlers: new winston.transports.File({
    filename: "exception.log",
  }),
});
