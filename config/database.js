const Sequelize = require("sequelize");
const logger = require("./logger");
const env = process.env.NODE_ENV || "development";
const db = require("./database.json")[env];

const sequelize = new Sequelize(db.name, db.username, db.password, {
  host: db.host,
  dialect: "mysql",
});
sequelize
  .authenticate()
  .then(() => {
    logger.info("Connection to database has been established successfully.");
  })
  .catch((err) => {
    logger.error("ERROR: Unable to connect to the database:", err);
  });
sequelize.sync({ alter: true });

module.exports = sequelize;
