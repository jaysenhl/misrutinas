import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdAddCircle, MdList, MdPerson, MdLogout } from 'react-icons/md';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <h1>Hola {user?.username || 'Usuario'}</h1>
      <div className="menu-buttons">
        <Link to="/crear-rutina" className="menu-button">
          <MdAddCircle className="button-icon" />
          Crear Rutina
        </Link>
        <Link to="/ver-rutinas" className="menu-button">
          <MdList className="button-icon" />
          Ver Rutinas
        </Link>
        <Link to="/mi-info" className="menu-button">
          <MdPerson className="button-icon" />
          Mi Info
        </Link>
      </div>
      
     
    </div>
  );
};

export default Dashboard; 