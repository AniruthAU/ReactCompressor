import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import io from 'socket.io-client';

// Register components with Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const socket = io('http://localhost:3000'); // Connect to your server

function CpuUsageChart() {
  const [cpuUsage, setCpuUsage] = useState([]);

  useEffect(() => {
    socket.on('cpuUsage', (data) => {
      setCpuUsage((prevData) => {
        const updatedData = [...prevData, data.usage];
        if (updatedData.length > 10) updatedData.shift(); // Keep last 10 values
        return updatedData;
      });
    });

    return () => {
      socket.off('cpuUsage');
    };
  }, []);

  const data = {
    labels: Array(cpuUsage.length).fill(''), // Labels for the line chart
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: cpuUsage,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        display: false, // Hides the X axis
      },
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div>
      <h3>CPU Usage Over Time</h3>
      <Line data={data} options={options} />
    </div>
  );
}

export default CpuUsageChart;
