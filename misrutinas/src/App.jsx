import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WorkoutProvider } from './context/WorkoutContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import CreateRoutine from './pages/CreateRoutine';
import ViewRoutines from './pages/ViewRoutines';
import MyInfo from './pages/MyInfo';
import Drafts from './pages/Drafts';
import './styles/App.css';

function App() {
  return (
    <WorkoutProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/crear-rutina" element={<CreateRoutine />} />
              <Route path="/borradores" element={<Drafts />} />
              <Route path="/ver-rutinas" element={<ViewRoutines />} />
              <Route path="/mi-info" element={<MyInfo />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </WorkoutProvider>
  );
}

export default App;
