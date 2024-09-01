import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import LatestNewsMarquee from './LatestNewsMarquee'; // Import the marquee component

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const socket = io('http://localhost:3000'); // Connect to your server

function VideoTrim() {
  const [videoFile, setVideoFile] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [progress, setProgress] = useState(0);
  const [downloadLink, setDownloadLink] = useState('');
  const [cpuUsage, setCpuUsage] = useState([]);

  useEffect(() => {
    socket.on('trimProgress', (data) => {
        const percent = Math.max(1, Math.min(100, data.percent)); // Ensure progress is between 1 and 100
        setProgress(percent);
    });

    socket.on('cpuUsage', (data) => {
        setCpuUsage((prevData) => {
            const updatedData = [...prevData, data.usage];
            if (updatedData.length > 10) updatedData.shift(); // Keep last 10 values
            return updatedData;
        });
    });

    return () => {
        socket.off('trimProgress');
        socket.off('cpuUsage');
    };
  }, []);

  useEffect(() => {
    if (progress === 100 && downloadLink === '') {
      setDownloadLink(''); // Reset downloadLink
    }
  }, [progress, downloadLink]);

  const handleTrim = async () => {
    if (!videoFile || !startTime || !endTime) {
      alert('Please select a video file and specify start and end times.');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('startTime', startTime);
    formData.append('endTime', endTime);

    try {
      const token = localStorage.getItem('authToken'); // Ensure you're sending the token for authentication
      const response = await axios.post('http://localhost:3000/trim', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setDownloadLink(response.data.downloadLink);
      setProgress(100); // Set progress to 100% when done
    } catch (err) {
      console.error('Trimming failed', err);
      alert('Trimming failed');
    }
  };

  const cpuData = {
    labels: Array(cpuUsage.length).fill(''),
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

  const cpuOptions = {
    scales: {
      x: {
        display: false,
      },
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="trim-container">
      <h2>Trim Video</h2>
      <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
      <input
        type="text"
        placeholder="Start Time (seconds)"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
      <input
        type="text"
        placeholder="End Time (seconds)"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />
      <button onClick={handleTrim} disabled={!videoFile || !startTime || !endTime}>
        Trim and Download
      </button>

      <div>
        {progress > 0 && progress < 100 && (
          <div>
            <p>Trimming Progress: {progress}%</p>
            <progress value={progress} max="100"></progress>
          </div>
        )}

        {progress === 100 && downloadLink && (
          <div>
            <a href={`http://localhost:3000${downloadLink}`} download>
              <button>Download Trimmed Video</button>
            </a>
            <video controls src={`http://localhost:3000${downloadLink}`} className="video-player"></video>
          </div>
        )}
      </div>

      <div style={{ width: '300px', height: '200px', margin: 'auto' }}>
        <h3>CPU Usage Over Time</h3>
        <Line data={cpuData} options={cpuOptions} />
      </div>

      {/* Add the Latest News Marquee here */}
      <LatestNewsMarquee />
    </div>
  );
}

export default VideoTrim;
