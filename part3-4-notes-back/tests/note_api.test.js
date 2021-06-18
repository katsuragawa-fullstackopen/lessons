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
  const noteObjects = helper.initialNotes.map((note) => new Note(note)); // create all note objects as an array
  const promisseArray = noteObjects.map((note) => note.save()); // save they in the db
  await Promise.all(promisseArray); // await all promisses in the array


  /* or you can use a for loop
  for (let note of helper.initialNotes) {
    const noteObject = new Note(note);
    await noteObject.save();
  } 
  */

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
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
});

// get one note by id
test("A specific note can be viewed", async () => {
  const notesAtStart = await helper.notesInDb();
  const noteToView = notesAtStart[0];

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  /* perform similar JSON serialization and parsing for the noteToView
  as the server is performing for the note object (response.json()). */
  const processedNoteToView = JSON.parse(JSON.stringify(noteToView));

  expect(resultNote.body).toEqual(processedNoteToView);
});

// delete a note
test("A note can be deleted", async () => {
  const notesAtStart = await helper.notesInDb();
  const noteToDelete = notesAtStart[0];

  const deletedNote = await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204);

  const notesAtEnd = await helper.notesInDb();
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1);

  const contents = notesAtEnd.map((n) => n.content);
  expect(contents).not.toContain(noteToDelete.content);
});

// action after testes are completed
afterAll(() => {
  mongoose.connection.close();
});
