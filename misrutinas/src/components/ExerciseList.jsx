import React from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { MdAdd } from 'react-icons/md';
import { SortableExerciseItem } from './SortableExerciseItem';
import '../styles/ExerciseList.css';

const ExerciseList = () => {
  const { state } = useWorkout();
  const exercises = state.currentWorkout?.exercises || [];

  if (exercises.length === 0) {
    return (
      <div className="empty-exercise-list">
        <p>No hay ejercicios añadidos</p>
        <MdAdd className="empty-icon" />
      </div>
    );
  }

  return (
    <div className="exercise-list">
      {exercises.map((exercise) => (
        <SortableExerciseItem
          key={exercise.id}
          exercise={exercise}
        />
      ))}
    </div>
  );
};

export default ExerciseList; 