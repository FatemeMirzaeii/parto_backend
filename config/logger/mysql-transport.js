const Transport = require("winston-transport");
const { log } = require("../../models");

class Mysql_tranport extends Transport {
  constructor(opts) {
    super(opts);
  }
  async log(info, callback) {
    await log.create({
      level: info.level,
      message: info.message,
      time: info.timestamp,
    });
    setImmediate(() => {
      this.emit("logged", info);
    });
    callback();
  }
}

module.exports = Mysql_tranport;
