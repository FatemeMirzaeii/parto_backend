const winston = require("winston");
const winston_mysql = require("winston-mysql");
const db = require("./database.json");

const options = {
  host: db.host,
  user: db.username,
  password: db.password,
  database: db.name,
  table: "sys_logs_default",
};

winston.configure({
  transports: [
    new winston.transports.File({
      filename: "error.log",
    }),
    //new winston_mysql(options),
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
