const Sequelize = require("sequelize");
const db = require("./database.json");

const sequelize = new Sequelize(db.name, db.username, db.password, {
  host: db.host,
  dialect: "mysql",
});
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection to database has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
sequelize.sync({ alter: true });

module.exports = sequelize;
