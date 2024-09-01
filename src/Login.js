// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/login', { username, password });
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token); // Store the token
        localStorage.setItem('isAdmin', response.data.isAdmin); // Store the admin status

        // Navigate based on admin status
        if (response.data.isAdmin) {
          navigate('/metrics'); // Navigate to metrics page for admin
        } else {
          navigate('/upload'); // Navigate to the upload page for normal users
        }
      }
    } catch (err) {
      setError('Invalid credentials, please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>
        Not registered? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}

export default Login;
