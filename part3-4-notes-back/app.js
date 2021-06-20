const express = require("express"); // import express - CommonJS format
require("express-async-errors");
const cors = require("cors");
const mongoose = require("mongoose");
const notesRouter = require("./controllers/notes");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");

const app = express(); // create an express application

// connect to database
logger.info("Connecting to", config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB", error.message);
  });

app.use(cors());
app.use(express.static("build")); // serve the static file (frontend in this case)
app.use(express.json()); // parse incoming request with json payloads

app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
