const express = require("express"); // import express - CommonJS format
const app = express(); // create an express application

app.use(express.json());

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
const cors = require("cors");
app.use(cors());

// notes data
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
];

// route at the root, response the HTTP request sending hey world
app.get("/", (request, response) => {
  response.send("<h1>Hey world</h1>");
});

// route at api/notes, response the get HTTP request with notes in json format
// express automatically sets the Content-Type header with the appropriate value of application/json.
app.get("/api/notes", (request, response) => {
  console.log(request.headers);
  response.json(notes);
});

// route for single note by id
app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);
  console.log(id, note);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

// create new id that's max id + 1
const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((note) => note.id)) : 0;
  return maxId;
};

// create note
app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    id: generateId() + 1,
    content: body.content,
    date: new Date(),
    important: body.important || false,
    // if both it's false, return false, if important in the body its true, return true (clever!)
  };

  notes.push(note);
  console.log(note, notes);

  response.json(note);
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

// bind the http server to app variable
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
