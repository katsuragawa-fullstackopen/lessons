const express = require("express"); // import express - CommonJS format
const cors = require("cors");
require("dotenv").config();
const Note = require("./models/note");

const app = express(); // create an express application
app.use(express.json()); // parse incomming request with json payloads
app.use(express.static("build")); // serve the static file (frontend in this case)

// our middleware to show some infos
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path: ", request.path);
  console.log("Body: ", request.body);
  console.log("----");
  next();
};
app.use(requestLogger);

// cross-origin resourse sharing (3000 and 3001 can't communicate by default)
app.use(cors());

/* ------------- route handles ---------------------- */
// route at api/notes, response the get HTTP request with notes in json format
// express automatically sets the Content-Type header with the appropriate value of application/json.
app.get("/api/notes", (request, response) => {
  // fetch notes from database
  Note.find({}).then((notes) => {
    // when response method stringify the JSON, call the toJSON defined above
    response.json(notes);
  });
});

// route for single note by id
app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// create note
app.post("/api/notes", (request, response, next) => {
  const body = request.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => next(error));
});

// delete request by id
app.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// toggle importance
app.put("/api/notes/:id", (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  // with { new: true }, findOneAndUpdate() will instead give you the object after update was applied.
  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

// middleware function when none above was called
const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: "Unknown endpoint" });
};
app.use(unknownEndpoint);

// middleware for error, when some request catch a error, sent to the next function, here in this case
const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

/* ------------ connect to PORT ----------------- */
// bind the http server to app variable
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
