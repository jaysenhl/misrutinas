import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import WorkoutForm from '../components/WorkoutForm';
import ExerciseList from '../components/ExerciseList';
import ExerciseNotes from '../components/ExerciseNotes';
import Swal from 'sweetalert2';
import '../styles/CreateRoutine.css';
import YoutubeVideo from '../components/YoutubeVideo';
import RestTimer from '../components/RestTimer';

const CreateRoutine = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useWorkout();

  useEffect(() => {
    // Solo crear un nuevo borrador si no hay uno actual y no venimos de la página de borradores
    if (!state.currentWorkout && !location.state?.fromDrafts) {
      dispatch({ type: 'CREATE_DRAFT' });
    }

    // Preguntar antes de salir si hay cambios sin guardar
    const handleBeforeUnload = (e) => {
      if (state.currentWorkout) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.currentWorkout, dispatch, location.state]);

  const handleSaveDraft = async () => {
    const result = await Swal.fire({
      title: '¿Guardar borrador?',
      text: "Puedes continuar editándolo más tarde",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d35400',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      dispatch({ type: 'SAVE_DRAFT' });
      navigate('/borradores');
    }
  };

  return (
    <div className="create-routine">
      <h1>Crear Rutina</h1>
      <WorkoutForm />
      <ExerciseNotes />
      <YoutubeVideo />
      <RestTimer />
      <h1 className='mt-4'>Ejercicios</h1>
      <ExerciseList />
      <div className="action-buttons">
        <button className="save-draft-btn" onClick={handleSaveDraft}>
          Guardar Borrador
        </button>
      </div>
    </div>
  );
};

export default CreateRoutine; 