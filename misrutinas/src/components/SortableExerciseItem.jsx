import React, { useState } from 'react';
import { 
  MdContentCopy, 
  MdDelete, 
  MdEdit, 
  MdCheck, 
  MdClose, 
  MdArrowForward,
  MdVisibility,
  MdVisibilityOff
} from 'react-icons/md';
import { useWorkout } from '../context/WorkoutContext';
import Swal from 'sweetalert2';

export function SortableExerciseItem({ exercise }) {
  const { dispatch } = useWorkout();
  const [editingSet, setEditingSet] = useState(null);
  const [editValues, setEditValues] = useState({ weight: '', reps: '' });
  const [isExpanded, setIsExpanded] = useState(true);

  const handleEditSet = (setIndex, set) => {
    setEditingSet(setIndex);
    setEditValues({ weight: set.weight.toString(), reps: set.reps.toString() });
  };

  const handleSaveSet = (setIndex) => {
    const weight = parseFloat(editValues.weight);
    const reps = parseInt(editValues.reps);

    if (isNaN(weight) || isNaN(reps) || weight < 0 || reps < 1) {
      Swal.fire({
        icon: 'error',
        title: 'Valores inválidos',
        text: 'Por favor ingresa valores válidos para peso y repeticiones'
      });
      return;
    }

    dispatch({
      type: 'UPDATE_SET',
      payload: {
        exerciseId: exercise.id,
        setIndex,
        updates: { weight, reps }
      }
    });
    setEditingSet(null);
  };

  const handleDeleteExercise = async () => {
    const result = await Swal.fire({
      title: '¿Eliminar ejercicio?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      dispatch({
        type: 'DELETE_EXERCISE',
        payload: exercise.id
      });
    }
  };

  const handleDuplicateExercise = () => {
    dispatch({
      type: 'DUPLICATE_EXERCISE',
      payload: {
        ...exercise,
        id: Date.now().toString()
      }
    });

    // Añadimos el Swal alert de éxito
    Swal.fire({
      icon: 'success',
      title: '¡Ejercicio duplicado!',
      text: `Se ha duplicado ${exercise.name}`,
      showConfirmButton: false,
      timer: 1500
    });
  };

  const handleSetComplete = (setIndex) => {
    dispatch({
      type: 'TOGGLE_SET_COMPLETE',
      payload: { exerciseId: exercise.id, setIndex }
    });
  };

  return (
    <div className="exercise-card" data-expanded={isExpanded}>
      <div className="exercise-header">
        <div className="exercise-info">
          <div className="exercise-name-equipment">
            <div className="name-with-toggle">
              <h3>{exercise.name}</h3>
              <button 
                className="toggle-exercise-btn"
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
            {isExpanded && (
              <div className="equipment-info">
                <MdArrowForward />
                <span>{exercise.equipment}</span>
              </div>
            )}
          </div>
          {isExpanded && (
            <span className="exercise-category">Categoría: {exercise.category}</span>
          )}
        </div>
        {isExpanded && (
          <div className="exercise-actions">
            <button className="copy" onClick={handleDuplicateExercise} title="Duplicar">
              <MdContentCopy size={40} />
            </button>
            <button className="delete" onClick={handleDeleteExercise} title="Eliminar">
              <MdDelete size={40} />
            </button>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="sets-container">
          {exercise.sets.map((set, setIndex) => (
            <div key={setIndex} className="set-row">
              <span className="set-number">Set {setIndex + 1}</span>
              
              {editingSet === setIndex ? (
                <>
                  <input
                    type="number"
                    className="edit-input"
                    value={editValues.weight}
                    onChange={(e) => setEditValues({ ...editValues, weight: e.target.value })}
                    placeholder="Peso"
                    min="0"
                    step="0.5"
                  />
                  <input
                    type="number"
                    className="edit-input"
                    value={editValues.reps}
                    onChange={(e) => setEditValues({ ...editValues, reps: e.target.value })}
                    placeholder="Reps"
                    min="1"
                  />
                  <div className="edit-actions">
                    <button onClick={() => handleSaveSet(setIndex)} className="edit-btn save">
                      <MdCheck />
                    </button>
                    <button onClick={() => setEditingSet(null)} className="edit-btn cancel">
                      <MdClose />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="set-weight">{set.weight} lb</span>
                  <span className="set-reps">{set.reps} reps</span>
                  <div className="set-actions">
                    <button
                      className="edit-set-btn"
                      onClick={() => handleEditSet(setIndex, set)}
                    >
                      <MdEdit />
                      Editar
                    </button>
                    <button
                      className={`complete-set-btn ${set.completed ? 'completed' : ''}`}
                      onClick={() => handleSetComplete(setIndex)}
                    >
                      {set.completed ? 'Completado' : 'Completar'}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 