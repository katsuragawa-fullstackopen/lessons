const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");

// wraps the express app with the supertest function
const api = supertest(app);

const Note = require("../models/note");

// actions to take before the test
beforeEach(async () => {
  // clear database
  await Note.deleteMany({});

  // create and save notes
  let noteObject = new Note(helper.initialNotes[0]);
  await noteObject.save();

  noteObject = new Note(helper.initialNotes[1]);
  await noteObject.save();
});

test("Notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

// test length
test("All notes are returned", async () => {
  const response = await api.get("/api/notes");
  expect(response.body).toHaveLength(helper.initialNotes.length);
});

// first note content
test("A specific note is within the returned notes", async () => {
  const response = await api.get("/api/notes");
  const contents = response.body.map((note) => note.content);
  expect(contents).toContain("Browser can execute only Javascript");
});

// add note
test("A valid note can be added", async () => {
  const newNote = {
    content: "Async/await simplifies making async calls",
    important: true,
  };

  await api
    .post("/api/notes")
    .send(newNote)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const notesAtEnd = await helper.notesInDb();
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);

  const contents = notesAtEnd.map((n) => n.content);
  expect(contents).toContain("Async/await simplifies making async calls");
});

// add empity note
test("Empity content is not added", async () => {
  const newNote = {
    important: true,
  };

  await api.post("/api/notes").send(newNote).expect(400);

  const notesAtEnd = await helper.notesInDb();
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length)  


});

// action after testes are completed
afterAll(() => {
  mongoose.connection.close();
});
