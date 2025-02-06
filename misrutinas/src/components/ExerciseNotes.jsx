import React, { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdCheck, MdClose, MdVisibility, MdVisibilityOff, MdNoteAdd } from 'react-icons/md';
import { useWorkout } from '../context/WorkoutContext';
import '../styles/ExerciseNotes.css';

const ExerciseNotes = () => {
  const { state, dispatch } = useWorkout();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [editText, setEditText] = useState('');

  const handleAddNote = (e) => {
    e.preventDefault();
    if (newNote.trim()) {
      dispatch({ type: 'ADD_NOTE', payload: newNote.trim() });
      setNewNote('');
    }
  };

  const handleStartEdit = (note) => {
    setEditingNote(note.id);
    setEditText(note.text);
  };

  const handleSaveEdit = (id) => {
    if (editText.trim()) {
      dispatch({
        type: 'UPDATE_NOTE',
        payload: { id, text: editText.trim() }
      });
    }
    setEditingNote(null);
  };

  const handleDeleteNote = (id) => {
    dispatch({ type: 'DELETE_NOTE', payload: id });
  };

  return (
    <div className="exercise-notes">
      <div className="notes-header">
        <h2>
          <MdNoteAdd className="header-icon" />
          Notas de la Rutina
        </h2>
        <button 
          className="toggle-notes-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <MdVisibilityOff className="btn-icon" />
              <span className="btn-text">Ocultar</span>
            </>
          ) : (
            <>
              <MdVisibility className="btn-icon" />
              <span className="btn-text">Mostrar</span>
            </>
          )}
        </button>
      </div>

      <div className={`notes-content ${isExpanded ? 'expanded' : ''}`}>
        <form onSubmit={handleAddNote} className="add-note-form">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Añadir nueva nota..."
            className="note-input"
          />
          <button type="submit" className="add-note-btn">
            <MdAdd />
          </button>
        </form>

        <ul className="notes-list">
          {state.notes.map(note => (
            <li key={note.id} className="note-item">
              {editingNote === note.id ? (
                <div className="note-edit">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="edit-note-input"
                  />
                  <div className="note-actions">
                    <button 
                      onClick={() => handleSaveEdit(note.id)}
                      className="note-btn save"
                    >
                      <MdCheck />
                    </button>
                    <button 
                      onClick={() => setEditingNote(null)}
                      className="note-btn cancel"
                    >
                      <MdClose />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="note-content">
                  <span className="bullet">•</span>
                  <span className="note-text">{note.text}</span>
                  <div className="note-actions">
                    <button 
                      onClick={() => handleStartEdit(note)}
                      className="note-btn edit"
                    >
                      <MdEdit />
                    </button>
                    <button 
                      onClick={() => handleDeleteNote(note.id)}
                      className="note-btn delete"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExerciseNotes; 