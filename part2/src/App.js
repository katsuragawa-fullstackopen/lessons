import React, { useState } from "react";
import Note from "./components/Note";

const App = (props) => {
  const [notes, setNotes] = useState(props.notes);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);

  const addNote = (e) => {
    e.preventDefault();
    const noteObj = {
      id: notes.length + 1,
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
    };
    console.log(noteObj);
    setNotes(notes.concat(noteObj));
    console.log(notes.concat(noteObj));
    setNewNote("");
  };

  const handleNoteChange = (e) => {
    setNewNote(e.target.value);
    console.log(e.target.value);
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);
  console.log(notesToShow);

  return (
    <div className="container">
      <h1>Notes</h1>
      <div className="show">
        <button onClick={() => setShowAll(!showAll)}>
          Show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note key={note.id} note={note} />
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
