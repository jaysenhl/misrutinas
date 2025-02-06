import React from 'react';
import { Link } from 'react-router-dom';
import { MdAddCircle, MdList, MdPerson } from 'react-icons/md';
import '../styles/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Mis Rutinas</h1>
      <div className="menu-buttons">
        <Link to="/crear-rutina" className="menu-button">
          <MdAddCircle className="button-icon" />
          Crear Rutina
        </Link>
        <Link to="/ver-rutinas" className="menu-button">
          <MdList className="button-icon" />
          Ver Mis Rutinas
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