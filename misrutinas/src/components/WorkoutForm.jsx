import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { MdExpandMore, MdExpandLess, MdAdd, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import Swal from 'sweetalert2';
import '../styles/WorkoutForm.css';

const WorkoutForm = () => {
  const { state, dispatch } = useWorkout();
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [exerciseData, setExerciseData] = useState({
    name: '',
    category: '',
    equipment: '',
    weight: '',
    sets: '',
    reps: ''
  });

  const handleWorkoutNameChange = (e) => {
    dispatch({
      type: 'UPDATE_CURRENT_WORKOUT',
      payload: { name: e.target.value }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!exerciseData.name || !exerciseData.category) {
      Swal.fire({
        icon: 'error',
        title: 'Campos requeridos',
        text: 'Por favor completa el nombre y la categoría del ejercicio'
      });
      return;
    }

    dispatch({
      type: 'ADD_EXERCISE',
      payload: {
        id: Date.now().toString(),
        ...exerciseData,
        sets: Array(Number(exerciseData.sets)).fill({
          weight: Number(exerciseData.weight),
          reps: Number(exerciseData.reps),
          completed: false
        })
      }
    });

    setExerciseData({
      name: '',
      category: '',
      equipment: '',
      weight: '',
      sets: '',
      reps: ''
    });
  };

  return (
    <div className="workout-form">
      <input
        type="text"
        placeholder="Nombre de la Rutina"
        value={state.currentWorkout?.name || ''}
        onChange={handleWorkoutNameChange}
        className="routine-name-input"
      />
      
      <div className="form-header">
        <h2>Añadir Ejercicio</h2>
        <button 
          type="button"
          className="toggle-form-btn"
          onClick={() => setIsFormExpanded(!isFormExpanded)}
        >
          {isFormExpanded ? (
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

      <div className={`exercise-form-container ${isFormExpanded ? 'expanded' : ''}`}>
        <form onSubmit={handleSubmit} className="exercise-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="Categoría"
              value={exerciseData.category}
              onChange={(e) => setExerciseData({...exerciseData, category: e.target.value})}
            />
            <input
              type="text"
              placeholder="Nombre del Ejercicio"
              value={exerciseData.name}
              onChange={(e) => setExerciseData({...exerciseData, name: e.target.value})}
            />
          </div>

          <div className="form-row">
            <select
              value={exerciseData.equipment}
              onChange={(e) => setExerciseData({...exerciseData, equipment: e.target.value})}
            >
              <option value="">Selecciona el equipo</option>
              <option value="peso-corporal">Peso Corporal</option>
              <option value="maquina">Máquina</option>
              <option value="mancuernas">Mancuernas</option>
              <option value="kettlebells">Kettlebells</option>
              <option value="barra">Barra</option>
            </select>
            
            <input
              type="number"
              placeholder="Peso (lb)"
              value={exerciseData.weight}
              onChange={(e) => setExerciseData({...exerciseData, weight: e.target.value})}
              min="0"
              step="0.5"
            />
          </div>

          <div className="form-row">
            <input
              type="number"
              placeholder="Sets"
              value={exerciseData.sets}
              onChange={(e) => setExerciseData({...exerciseData, sets: e.target.value})}
              min="1"
              max="100"
            />
            <input
              type="number"
              placeholder="Repeticiones"
              value={exerciseData.reps}
              onChange={(e) => setExerciseData({...exerciseData, reps: e.target.value})}
              min="1"
              max="100"
            />
          </div>

          <button type="submit" className="add-exercise-btn">
            <MdAdd className="btn-icon" />
            Añadir Ejercicio
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkoutForm; 