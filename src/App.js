import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Navbar'; // Ensure Navbar is imported
import Login from './Login';
import Register from './Register';

import VideoUpload from './VideoUpload';
import VideoTrim from './VideoTrim';
import Metrics from './Metrics';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />  {/* Ensure Navbar is always rendered */}
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<VideoUpload />} />
          <Route path="/trim" element={<VideoTrim />} />
          <Route path="/metrics" element={<Metrics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
