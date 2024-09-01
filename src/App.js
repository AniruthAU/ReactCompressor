import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useLocation } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import VideoUpload from './VideoUpload';
import VideoTrim from './VideoTrim'; // Assuming you have a VideoTrim component
import './App.css';

function Navbar() {
  const location = useLocation();

  // Don't show the navbar on login and register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/upload">Compress</Link>
        <Link to="/trim">Trim</Link>
      </div>
      <div className="nav-middle">
        <h1>Video Processor</h1> {/* App name */}
      </div>
      <div className="nav-right">
        <button onClick={() => {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }}>Logout</button>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<VideoUpload />} />
          <Route path="/trim" element={<VideoTrim />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
