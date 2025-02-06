import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import CreateRoutine from './pages/CreateRoutine';
import ViewRoutines from './pages/ViewRoutines';
import MyInfo from './pages/MyInfo';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/crear-rutina" element={<CreateRoutine />} />
            <Route path="/ver-rutinas" element={<ViewRoutines />} />
            <Route path="/mi-info" element={<MyInfo />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
