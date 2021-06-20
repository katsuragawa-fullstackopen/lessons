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
  const promisesArray = noteObjects.map((note) => note.save()); // save they in the db
  await Promise.all(promisesArray); // await all promises in the array

  /* or you can use a for loop
  for (let note of helper.initialNotes) {
    const noteObject = new Note(note);
    await noteObject.save();
  } 
  */
});

describe("When there's initially some notes saved", () => {
  test("notes are returned as json", async () => {
    await api
      .get("/api/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  // test length
  test("all notes are returned", async () => {
    const response = await api.get("/api/notes");
    expect(response.body).toHaveLength(helper.initialNotes.length);
  });

  // first note content
  test("a specific note is within the returned notes", async () => {
    const response = await api.get("/api/notes");
    const contents = response.body.map((note) => note.content);
    expect(contents).toContain("Browser can execute only Javascript");
  });
});

describe("Viewing a specific note", () => {
  // get one note by id
  test("succeeds with valid id", async () => {
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

  test("fails with status 404 if note don't exist", async () => {
    const validNonExistingId = helper.nonExistingId();
    await api.get(`/api/notes${validNonExistingId}`).expect(404);
  });

  test("fails with status 400 if ID is invalid", async () => {
    const invalidId = "6acdyus87263gamnn";
    await api.get(`/api/notes/${invalidId}`).expect(400);
  });
});

describe("Addition of a new note", () => {
  // add note
  test("succeeds with valid data", async () => {
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

  // add empty note
  test("fails with status 400 if content it's empty", async () => {
    const newNote = {
      important: true,
    };

    await api.post("/api/notes").send(newNote).expect(400);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
  });
});

describe("Deletion of a note", () => {
  // delete a note
  test("succeeds with status 204 if id is valid", async () => {
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
});
// action after testes are completed
afterAll(() => {
  mongoose.connection.close();
});
