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
app.get("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id).then((note) => {
    response.json(note);
  });
});

// create note
app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

// delete request by id
app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  // 204 if succeed, 404 if not found, but in this case only 204 for simplicity
  response.status(204).end();
});

// middleware function when none above was called
const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: "Unknown endpoint" });
};
app.use(unknownEndpoint);

/* ------------ connect to PORT ----------------- */
// bind the http server to app variable
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
