const express = require("express");
const sequelize = require("./config/database");
const cycle = require("./routes/cycle");
const pregnancy = require("./routes/pregnancy");
const article = require("./routes/article");
const interview = require("./routes/interview");
const healthTracking = require("./routes/health-tracking");
const note = require("./routes/note");
const app = express();

app.use(express.json());
app.use("/cycle", cycle);
app.use("/pregnancy", pregnancy);
app.use("/article", article);
app.use("/interview", interview);
app.use("/healthTracking", healthTracking);
app.use("/note", note);

app.get("/", (req, res) => {
  res.send("Hello from Parto!!!");
});

app.listen(3000, () => console.log("Listening on port 3000..."));
