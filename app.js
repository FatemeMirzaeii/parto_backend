require("express-async-errors");
require("./models/index");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const nodeadmin = require("nodeadmin");
const error = require("./middleware/error");
const logger = require("./config/logger/logger");
const cycle = require("./routes/cycle");
const pregnancy = require("./routes/pregnancy");
const article = require("./routes/article");
const interview = require("./routes/interview");
const healthTracking = require("./routes/health-tracking");
const note = require("./routes/note");
const user = require("./routes/user");
const auth = require("./routes/auth");
const contactUs = require("./routes/contactUs");
const survey = require("./routes/survey");
const profile = require("./routes/profile");
const cookieParser = require('cookie-parser')

const app = express();

app.use(cookieParser());
const whitelist = ['https://test.parto.app', 'http://localhost:3925','http://localhost:2216']
app.use(cors({
  origin: function (origin, callback) {
    // bypass the requests with no origin (like curl requests, mobile apps, etc )
    if (!origin) return callback(null, true);
 
    if (whitelist.indexOf(origin) === -1) {
      var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials :true,
  exposedHeaders: 'x-auth-token'
}));
app.use(helmet());
app.use(nodeadmin(app));
app.use(express.json());
app.use("/cycle", cycle);
app.use("/pregnancy", pregnancy);
app.use("/article", article);
app.use("/interview", interview);
app.use("/healthTracking", healthTracking);
app.use("/note", note);
app.use("/user", user);
app.use("/auth", auth);
app.use("/contactUs", contactUs);
app.use("/survey", survey);
app.use("/profile", profile);
app.use(error);

console.log(process.env.NODE_PORT);

app.use(express.static(`../../Fattahi/deploy/production/build`));
app.get("/*", (req, res) => {
  res.sendFile("index.html", { root: "../../Fattahi/deploy/production/build" });
});

const server = app.listen(2218, () => logger.info("Listening on port 2218..."));
module.exports = server;
