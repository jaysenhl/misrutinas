import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import { MdEdit, MdDelete, MdAccessTime } from 'react-icons/md';
import Swal from 'sweetalert2';
import '../styles/Drafts.css';

const Drafts = () => {
  const { state, dispatch } = useWorkout();
  const navigate = useNavigate();

  const handleLoadDraft = async (draft) => {
    if (state.currentWorkout) {
      const result = await Swal.fire({
        title: '¿Cargar borrador?',
        text: "Perderás los cambios no guardados de la rutina actual",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d35400',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Cargar',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) return;
    }

    dispatch({ type: 'LOAD_DRAFT', payload: draft });
    navigate('/crear-rutina', { state: { fromDrafts: true } });
  };

  const handleDeleteDraft = async (draftId) => {
    const result = await Swal.fire({
      title: '¿Eliminar borrador?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      dispatch({ type: 'DELETE_DRAFT', payload: draftId });
    }
  };

  if (state.drafts.length === 0) {
    return (
      <div className="drafts-empty">
        <h1>Borradores</h1>
        <p>No hay borradores guardados</p>
      </div>
    );
  }

  return (
    <div className="drafts">
      <h1>Borradores</h1>
      <div className="drafts-list">
        {state.drafts.map(draft => (
          <div key={draft.id} className="draft-card">
            <div className="draft-header">
              <h3>{draft.name || 'Rutina sin nombre'}</h3>
              <div className="draft-actions">
                <button 
                  className="draft-action-btn edit"
                  onClick={() => handleLoadDraft(draft)}
                >
                  <MdEdit />
                </button>
                <button 
                  className="draft-action-btn delete"
                  onClick={() => handleDeleteDraft(draft.id)}
                >
                  <MdDelete />
                </button>
              </div>
            </div>
            <div className="draft-info">
              <div className="draft-date">
                <MdAccessTime />
                <span>
                  Última modificación: {new Date(draft.lastModified).toLocaleDateString()}
                </span>
              </div>
              <p className="draft-exercises">
                Ejercicios: {draft.exercises.length}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Drafts; 