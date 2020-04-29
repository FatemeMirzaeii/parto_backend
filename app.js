const express = require("express");
const helmet = require("helmet");
var fs = require("fs");
require("./config/database");
require("./config/logger");
const cycle = require("./routes/cycle");
const pregnancy = require("./routes/pregnancy");
const article = require("./routes/article");
const interview = require("./routes/interview");
const healthTracking = require("./routes/health-tracking");
const note = require("./routes/note");
const user = require("./routes/user");
const auth = require("./routes/auth");
const app = express();

process.on("uncaughtException", (ex) => {
  winston.error(ex.message, ex);
});

app.use(helmet());
app.use(express.json());
app.use("/cycle", cycle);
app.use("/pregnancy", pregnancy);
app.use("/article", article);
app.use("/interview", interview);
app.use("/healthTracking", healthTracking);
app.use("/note", note);
app.use("/user", user);
app.use("/auth", auth);

if (!fs.readFileSync("./private.key", "utf8")) {
  console.error("FATAL ERROR: jwt secret is not defined.");
  process.exit(1);
}

app.get("/", (req, res) => {
  res.send("Hello from Parto!!!");
});

app.listen(2218, () => console.log("Listening on port 2218..."));
