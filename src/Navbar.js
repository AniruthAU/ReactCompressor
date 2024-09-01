// src/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  // Don't show the navbar on login and register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  // Retrieve the admin status from localStorage (or decode from the token)
  const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/upload">Compress</Link>
        <Link to="/trim">Trim</Link>
        {isAdmin && <Link to="/metrics">Metrics</Link>} {/* Show Metrics link only for admin */}
      </div>
      <div className="nav-middle">
        <h1>Video Processor</h1> {/* App name */}
      </div>
      <div className="nav-right">
        <button onClick={() => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('isAdmin'); // Clear the admin status
          window.location.href = '/login';
        }}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
