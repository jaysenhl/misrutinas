import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdHome, MdAddCircle, MdList, MdPerson } from 'react-icons/md';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
    </nav>
  );
};

export default Navbar; 