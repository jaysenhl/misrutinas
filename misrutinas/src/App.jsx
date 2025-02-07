import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WorkoutProvider } from './context/WorkoutContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import CreateRoutine from './pages/CreateRoutine';
import ViewRoutines from './pages/ViewRoutines';
import MyInfo from './pages/MyInfo';
import Login from './pages/Login';
import Drafts from './pages/Drafts';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <WorkoutProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Ruta pública - sin Navbar */}
              <Route path="/login" element={<Login />} />

              {/* Layout para rutas protegidas */}
              <Route element={
                <ProtectedRoute>
                  <div className="app-container">
                    <Navbar />
                    <div className="main-content">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/crear-rutina" element={<CreateRoutine />} />
                        <Route path="/ver-rutinas" element={<ViewRoutines />} />
                        <Route path="/mi-info" element={<MyInfo />} />
                        <Route path="/borradores" element={<Drafts />} />
                      </Routes>
                    </div>
                    <Footer />
                  </div>
                </ProtectedRoute>
              }>
                <Route path="/" element={<Dashboard />} />
                <Route path="/crear-rutina" element={<CreateRoutine />} />
                <Route path="/ver-rutinas" element={<ViewRoutines />} />
                <Route path="/mi-info" element={<MyInfo />} />
                <Route path="/borradores" element={<Drafts />} />
              </Route>

              {/* Redirigir cualquier otra ruta a Dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </WorkoutProvider>
    </AuthProvider>
  );
}

export default App;
