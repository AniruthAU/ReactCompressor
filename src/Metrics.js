// src/Metrics.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Metrics() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login'); // Redirect to login if no token is found
        }

        const response = await axios.get('http://localhost:3000/metrics', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMetrics(response.data);
      } catch (err) {
        setError('Failed to fetch metrics');
      }
    };

    fetchMetrics();
  }, [navigate]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!metrics) {
    return <p>Loading...</p>;
  }

  return (
    <div className="metrics-container">
      <h2>Admin Metrics</h2>
      <p>Total Users: {metrics.totalUsers}</p>
      <p>Total Files Uploaded: {metrics.totalFilesUploaded}</p>
      <p>CPU Usage: {metrics.cpuUsage}%</p>
    </div>
  );
}

export default Metrics;
