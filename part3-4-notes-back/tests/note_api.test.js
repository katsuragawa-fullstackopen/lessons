const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

// wraps the express app with the supertest function
const api = supertest(app);

// create hardcoded notes for test
const Note = require("../models/note");
const initialNotes = [
  {
    content: "HTML is easy",
    date: new Date(),
    important: false,
  },
  {
    content: "Browser can execute only Javascript",
    date: new Date(),
    important: true,
  },
];

// actions to take before the test
beforeEach(async () => {
  // clear database
  await Note.deleteMany({});
  // create and save notes
  let noteObject = new Note(initialNotes[0]);
  await noteObject.save();
  noteObject = new Note(initialNotes[1]);
  await noteObject.save();
});

// test if notes are returned as json
test("Notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

// test length
test("All notes are returned", async () => {
  const response = await api.get("/api/notes");
  expect(response.body).toHaveLength(initialNotes.length);
});

// test first note content
test("A specific note is within the returned notes", async () => {
  const response = await api.get("/api/notes");
  const contents = response.body.map((note) => note.content);
  expect(contents).toContain("Browser can execute only Javascript");
});

// action after testes are completed
afterAll(() => {
  mongoose.connection.close();
});
