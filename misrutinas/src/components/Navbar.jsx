import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdHome, MdAddCircle, MdList, MdPerson, MdLogout } from 'react-icons/md';
import '../styles/Navbar.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <MdHome className="nav-icon" />
        Mis Rutinas
      </Link>
      
      <div className="hamburger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
        <li>
          <Link to="/" onClick={toggleMenu}>
            <MdHome className="nav-icon" />
            Inicio
          </Link>
        </li>
        <li>
          <Link to="/crear-rutina" onClick={toggleMenu}>
            <MdAddCircle className="nav-icon" />
            Crear Rutina
          </Link>
        </li>
        <li>
          <Link to="/ver-rutinas" onClick={toggleMenu}>
            <MdList className="nav-icon" />
            Ver Rutinas
          </Link>
        </li>
        <li>
          <Link to="/mi-info" onClick={toggleMenu}>
            <MdPerson className="nav-icon" />
            Mi Info
          </Link>
        </li>
      </ul>

      <button 
        className="logout-btn"
        onClick={handleLogout}
      >
        <MdLogout className="btn-icon" />
        Cerrar Sesión
      </button>
    </nav>
  );
};

export default Navbar; 