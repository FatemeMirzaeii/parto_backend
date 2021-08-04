require("express-async-errors");
require("./models/index");
const fileUpload = require('express-fileupload');
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const nodeadmin = require("nodeadmin");
const rateLimit = require("express-rate-limit");
const error = require("./middleware/error");
const logger = require("./config/logger/logger");
const cookieParser = require('cookie-parser');


// v1
const cycle1 = require("./routes/v1/cycle");
const pregnancy1 = require("./routes/v1/pregnancy");
const interview1 = require("./routes/v1/interview");
const healthTracking1 = require("./routes/v1/health-tracking");
const notes1 = require("./routes/v1/notes");
const user1 = require("./routes/v1/user");
const auth1 = require("./routes/v1/auth");
const contactUs1 = require("./routes/v1/contactUs");
const survey1 = require("./routes/v1/survey");
const payment1 = require("./routes/v1/payment");
const profile1 = require("./routes/v1/profile");
const message1= require("./routes/v1/message");


// v2
const healthTracking2 = require("./routes/v2/health-tracking");
const user2 = require("./routes/v2/user");


const app = express();
app.use(cookieParser());
const whitelist = ['https://my.parto.app', 'http://localhost:3925','http://localhost:2216']
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

const authenticatedLimiter = rateLimit({
  windowMs: 1000, // 1 second window
  max: 50, // start blocking after 10 requests
  message:
  { message: "تعداد درخواست های شما در چند دقیقه گذشته بیش از حد مجاز بوده است، لطفا پس از چند دقیقه دوباره امتحان کنید "},
  headers: true,
});

app.use("/cycle", authenticatedLimiter);
app.use("/pregnancy", authenticatedLimiter);
app.use("/interview", authenticatedLimiter);
app.use("/healthTracking", authenticatedLimiter);
app.use("/note", authenticatedLimiter);
app.use("/user", authenticatedLimiter);
app.use("/auth", authenticatedLimiter);
app.use("/profile", authenticatedLimiter);
// v2
app.use("/v2/healthTracking", authenticatedLimiter);
app.use("/v2/user", authenticatedLimiter);



const unauthenticatedLimiter = rateLimit({
  windowMs: 2*60 * 1000, // 2 minet window
  max: 15, // start blocking after 1 requests
  message:
  { message: "تعداد درخواست های شما در چند دقیقه گذشته بیش از حد مجاز بوده است، لطفا پس از چند دقیقه دوباره امتحان کنید "},
  headers: true,
});
app.use("/auth", unauthenticatedLimiter);
app.use("/contactUs", unauthenticatedLimiter);
app.use("/survey", authenticatedLimiter);

app.use(fileUpload());
app.use(helmet());
app.use(nodeadmin(app));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

//v1
app.use("/cycle", cycle1);
app.use("/pregnancy", pregnancy1);
app.use("/interview", interview1);
app.use("/healthTracking", healthTracking1);
app.use("/note", note1);
app.use("/user", user1);
app.use("/auth", auth1);
app.use("/contactUs", contactUs1);
app.use("/survey", survey1);
app.use("/profile", profile1);
// v2 
app.use("/v2/healthTracking", healthTracking2);
app.use("/v2/user", user2);

app.use(error);

console.log(process.env.NODE_PORT);

app.use(express.static(`../../Fattahi/deploy/production/build`));
app.get("/*", (req, res) => {
  res.sendFile("index.html", { root: "../../Fattahi/deploy/production/build" });
});

const server = app.listen(2218, () => logger.info("Listening on port 2218..."));
module.exports = server;
