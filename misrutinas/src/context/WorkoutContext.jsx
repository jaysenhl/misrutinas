import React, { createContext, useContext, useReducer, useEffect } from 'react';

const WorkoutContext = createContext();

const initialState = {
  currentWorkout: null,
  drafts: [],
  completedWorkouts: [],
  notes: []
};

function workoutReducer(state, action) {
  switch (action.type) {
    case 'CREATE_DRAFT':
      return {
        ...state,
        currentWorkout: {
          id: Date.now().toString(),
          name: '',
          exercises: [],
          created: new Date(),
          lastModified: new Date()
        }
      };
    case 'SAVE_DRAFT':
      const newDraft = {
        ...state.currentWorkout,
        lastModified: new Date()
      };
      return {
        ...state,
        drafts: [...state.drafts, newDraft],
        currentWorkout: null
      };
    case 'UPDATE_CURRENT_WORKOUT':
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          ...action.payload,
          lastModified: new Date()
        }
      };
    case 'ADD_EXERCISE':
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          exercises: [...state.currentWorkout.exercises, action.payload]
        }
      };
    case 'DELETE_EXERCISE':
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          exercises: state.currentWorkout.exercises.filter(
            exercise => exercise.id !== action.payload
          )
        }
      };
    case 'DUPLICATE_EXERCISE':
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          exercises: [...state.currentWorkout.exercises, action.payload]
        }
      };
    case 'REORDER_EXERCISES':
      const exercises = Array.from(state.currentWorkout.exercises);
      const [removed] = exercises.splice(action.payload.sourceIndex, 1);
      exercises.splice(action.payload.destinationIndex, 0, removed);
      
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          exercises
        }
      };
    case 'TOGGLE_SET_COMPLETE':
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          exercises: state.currentWorkout.exercises.map(exercise =>
            exercise.id === action.payload.exerciseId
              ? {
                  ...exercise,
                  sets: exercise.sets.map((set, index) =>
                    index === action.payload.setIndex
                      ? { ...set, completed: !set.completed }
                      : set
                  )
                }
              : exercise
          )
        }
      };
    case 'UPDATE_SET':
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          exercises: state.currentWorkout.exercises.map(exercise =>
            exercise.id === action.payload.exerciseId
              ? {
                  ...exercise,
                  sets: exercise.sets.map((set, index) =>
                    index === action.payload.setIndex
                      ? { ...set, ...action.payload.updates }
                      : set
                  )
                }
              : exercise
          )
        }
      };
    case 'LOAD_DRAFT':
      return {
        ...state,
        currentWorkout: action.payload,
        drafts: state.drafts.filter(draft => draft.id !== action.payload.id)
      };
    case 'DELETE_DRAFT':
      return {
        ...state,
        drafts: state.drafts.filter(draft => draft.id !== action.payload)
      };
    case 'ADD_NOTE':
      return {
        ...state,
        notes: [...state.notes, { id: Date.now().toString(), text: action.payload }]
      };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note => 
          note.id === action.payload.id 
            ? { ...note, text: action.payload.text }
            : note
        )
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload)
      };
    case 'DELETE_SET': {
      const { exerciseId, setIndex } = action.payload;
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          exercises: state.currentWorkout.exercises.map(exercise => {
            if (exercise.id === exerciseId) {
              return {
                ...exercise,
                sets: exercise.sets.filter((_, index) => index !== setIndex)
              };
            }
            return exercise;
          })
        }
      };
    }
    default:
      return state;
  }
}

export function WorkoutProvider({ children }) {
  const [state, dispatch] = useReducer(workoutReducer, initialState);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedState = localStorage.getItem('workoutState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      Object.keys(parsedState).forEach(key => {
        dispatch({ type: 'LOAD_STATE', payload: { key, value: parsedState[key] } });
      });
    }
  }, []);

  // Guardar en localStorage cuando cambie el estado
  useEffect(() => {
    localStorage.setItem('workoutState', JSON.stringify(state));
  }, [state]);

  return (
    <WorkoutContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
} 