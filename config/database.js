const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const db = require("./database.json")[env];

const sequelize = new Sequelize(db.name, db.username, db.password, {
  host: db.host,
  dialect: "mysql",
});
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection to database has been established successfully.");
  });
//sequelize.sync({ alter: true });

module.exports = sequelize;
