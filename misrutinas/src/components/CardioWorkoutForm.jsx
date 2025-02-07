import React, { useState } from 'react';
import { MdDirectionsRun, MdVisibility, MdVisibilityOff, MdAdd } from 'react-icons/md';
import { useWorkout } from '../context/WorkoutContext';
import Swal from 'sweetalert2';
import '../styles/CardioWorkoutForm.css';

const CardioWorkoutForm = () => {
  const { dispatch } = useWorkout();
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [exerciseData, setExerciseData] = useState({
    name: '',
    category: '',
    equipment: '',
    weight: '',
    sets: '',
    reps: '',
    distance: '',
    duration: ''
  });

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

    // Validar el formato de duración
    if (exerciseData.duration && !/^[0-9]{1,2}:[0-9]{2}:[0-9]{2}$/.test(exerciseData.duration)) {
      Swal.fire({
        icon: 'error',
        title: 'Formato inválido',
        text: 'El formato de duración debe ser hh:mm:ss'
      });
      return;
    }

    dispatch({
      type: 'ADD_EXERCISE',
      payload: {
        id: Date.now().toString(),
        ...exerciseData,
        type: 'cardio',
        sets: Array(Number(exerciseData.sets)).fill({
          weight: Number(exerciseData.weight),
          reps: Number(exerciseData.reps),
          distance: Number(exerciseData.distance),
          duration: exerciseData.duration,
          completed: false
        })
      }
    });

    Swal.fire({
      icon: 'success',
      title: '¡Ejercicio de cardio añadido!',
      text: `Se ha añadido ${exerciseData.name} a tu rutina`,
      showConfirmButton: false,
      timer: 1500
    });

    setExerciseData({
      name: '',
      category: '',
      equipment: '',
      weight: '',
      sets: '',
      reps: '',
      distance: '',
      duration: ''
    });
  };

  // Añadir esta función para manejar el cambio de equipo
  const handleEquipmentChange = (e) => {
    const equipment = e.target.value;
    setExerciseData({
      ...exerciseData,
      equipment,
      // Si es peso corporal, establecer 'N/A', si no, limpiar el campo
      weight: equipment === 'peso-corporal' ? 'N/A' : ''
    });
  };

  return (
    <div className="cardio-form">
      <label>Ejercicios De Cardio</label>
      <div className="form-header">
        <h2>
          <MdDirectionsRun className="header-icon" />
          Añadir Cardio
        </h2>
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
              placeholder="Categoría - ej: HIIT, Steady State, etc."
              value={exerciseData.category}
              onChange={(e) => setExerciseData({...exerciseData, category: e.target.value})}
            />
            <input
              type="text"
              placeholder="Nombre del Ejercicio - ej: Running, Cycling, etc."
              value={exerciseData.name}
              onChange={(e) => setExerciseData({...exerciseData, name: e.target.value})}
            />
          </div>

          <div className="form-row">
            <select
              value={exerciseData.equipment}
              onChange={handleEquipmentChange}
            >
              <option value="">Selecciona el equipo</option>
              <option value="peso-corporal">Peso Corporal</option>
              <option value="maquina">Máquina</option>
            </select>
            
            <input
              type="text"
              placeholder="Peso (lb)"
              value={exerciseData.weight}
              onChange={(e) => setExerciseData({...exerciseData, weight: e.target.value})}
              disabled={exerciseData.equipment === 'peso-corporal'}
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

          <div className="form-row">
            <input
              type="number"
              placeholder="Distancia (millas)"
              value={exerciseData.distance}
              onChange={(e) => setExerciseData({...exerciseData, distance: e.target.value})}
              min="0"
              step="0.1"
            />
            <input
              type="text"
              placeholder="Duración (hh:mm:ss)"
              value={exerciseData.duration}
              onChange={(e) => {
                const value = e.target.value;
                // Permitir formato más flexible mientras escribe
                if (value === '' || /^[0-9]{0,2}(:[0-9]{0,2})?(:[0-9]{0,2})?$/.test(value)) {
                  setExerciseData({...exerciseData, duration: value});
                }
              }}
              onBlur={(e) => {
                // Formatear al perder el foco
                const value = e.target.value;
                if (value) {
                  const parts = value.split(':');
                  const formattedParts = parts.map(part => part.padStart(2, '0'));
                  while (formattedParts.length < 3) formattedParts.unshift('00');
                  const formattedValue = formattedParts.join(':');
                  setExerciseData({...exerciseData, duration: formattedValue});
                }
              }}
            />
          </div>

          <button type="submit" className="add-exercise-btn">
            <MdAdd className="btn-icon" />
            Añadir Cardio
          </button>
        </form>
      </div>
    </div>
  );
};

export default CardioWorkoutForm; 