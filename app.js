require("express-async-errors");
require("./models/index");

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const express = require("express");
const path = require("path");
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
const contactUs=require("./routes/contactUs");
var cors = require("cors");


const app = express();

const swaggerDefinition = {
  info: {
    title: 'Parto Swagger API',
    version: '1.0.0',
    description: 'Endpoints to test parto app api',
  },
  servers: ["https://api.partobanoo.com"],
  basePath: '/',
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header',
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

// app.get('/swagger.json', (req, res) => {
//   res.setHeader('Content-Type', 'application/json');
//   res.send(swaggerSpec);
// });

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(error);
app.use(cors());


app.use(
  express.static(
    `/home/gitlab-runner/builds/Y3CZXGep/0/Fattahi/parto_web_v2/build`
  )
);

app.get("/*", (req, res) => {
  res.sendFile(
    path.join(
      `/home/gitlab-runner/builds/Y3CZXGep/0/Fattahi/parto_web_v2/`,
      "build",
      "index.html"
    )
  );
});

const server = app.listen(2218, () => logger.info("Listening on port 2218..."));
module.exports = server;
