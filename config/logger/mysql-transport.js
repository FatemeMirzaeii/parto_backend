const Transport = require('winston-transport');
const Log = require("../../models/Log");

class Mysql_tranport extends Transport {
    constructor(opts) {
        super(opts);
    }
    async log(info, callback) {
        await Log.create({
            level: info.level,
            message: info.message,
            timestamp: info.timestamp,
        });
        setImmediate(() => {
            this.emit('logged', info);
        });
        callback();
    }
};

module.exports = Mysql_tranport;