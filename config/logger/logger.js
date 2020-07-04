const winston = require("winston");
const mysql_transport = require("./mysql-transport");

winston. configure({
  transports: [
    new winston.transports.File({
      filename: "error.log",
    }),
    new mysql_transport(),
  ],
  exceptionHandlers: [
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({
      filename: "exception.log",
    }),
  ],
});

process.on("unhandledRejection", (ex) => {
  throw ex;
});
module.exports = winston;
