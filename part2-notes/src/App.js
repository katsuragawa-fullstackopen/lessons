import React, { useEffect, useState } from "react";
import Note from "./components/Note";
import noteService from "./services/note";

const Notification = ({ message }) => {
  const errorStyle = {
    width: "50%",
    margin: "auto",
    textAlign: "center",
    color: "rgb(207, 90, 90)",
    fontSize: 16,
    borderStyle: "solid",
    borderRadius: 20,
    padding: 10,
    marginBottom: 50,
  };
  if (message === null) {
    return null;
  }

  return <div style={errorStyle}>{message}</div>;
};

const App = () => {
  // setup hooks
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    noteService
      .getAll()
      .then((initialNotes) => {
        setNotes(initialNotes);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  console.log("render", notes.length, "notes");

  const addNote = (e) => {
    e.preventDefault();
    const noteObj = {
      // id: notes.length + 1,
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
    };

    noteService.create(noteObj).then((returnedNote) => {
      console.log(returnedNote);
      setNotes(notes.concat(returnedNote));
      setNewNote("");
    });
  };

  const handleNoteChange = (e) => {
    setNewNote(e.target.value);
  };

  const toggleImportance = (id) => {
    const note = notes.find((note) => note.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch((error) => {
        setErrorMessage(
          `The note "${note.content}" was already deleted from the server.`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((note) => note.id !== id));
      });
    console.log(notes);
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  return (
    <div className="container">
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div className="show">
        <button onClick={() => setShowAll(!showAll)}>
          Show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportance(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default App;
