require("express-async-errors");
const express = require("express");
const helmet = require("helmet");
const nodeadmin = require("nodeadmin");
const error = require("./middleware/error");
const logger = require("./config/logger");
require("./config/database");

const cycle = require("./routes/cycle");
const pregnancy = require("./routes/pregnancy");
const article = require("./routes/article");
const interview = require("./routes/interview");
const healthTracking = require("./routes/health-tracking");
const note = require("./routes/note");
const user = require("./routes/user");
const auth = require("./routes/auth");

const app = express();

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
app.use(error);

app.get("/", (req, res) => {
  res.send("Hello from Parto!!!");
});

app.listen(2218, () => logger.info("Listening on port 2218..."));
