import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import LatestNewsMarquee from './LatestNewsMarquee'; // Import the marquee component

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const socket = io('http://localhost:3000'); // Connect to your server

function VideoUpload() {
  const [videoFile, setVideoFile] = useState(null);
  const [resolution, setResolution] = useState('720p');
  const [progress, setProgress] = useState(0);
  const [downloadLink, setDownloadLink] = useState('');
  const [cpuUsage, setCpuUsage] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    socket.on('compressProgress', (data) => {
      setProgress((prevProgress) => Math.max(1, Math.min(100, data.percent)));
    });

    socket.on('cpuUsage', (data) => {
      setCpuUsage((prevData) => {
        const updatedData = [...prevData, data.usage];
        if (updatedData.length > 10) updatedData.shift(); // Keep last 10 values
        return updatedData;
      });
    });

    return () => {
      socket.off('compressProgress');
      socket.off('cpuUsage');
    };
  }, []);

  const handleCompress = async () => {
    if (!videoFile) {
      alert('Please select a video file.');
      return;
    }

    setIsUploading(true); // Disable the button during upload

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('resolution', resolution);

    try {
      const token = localStorage.getItem('authToken'); // Ensure you're sending the token for authentication
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setDownloadLink(response.data.downloadLink);
      setProgress(100); // Set progress to 100% when done
      setIsUploading(false); // Re-enable the button
    } catch (err) {
      console.error('Compression failed', err);
      alert('Compression failed');
      setIsUploading(false); // Re-enable the button even if there's an error
    }
  };

  const cpuData = {
    labels: cpuUsage.map((_, index) => `Point ${index + 1}`),
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
        display: true,
      },
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="upload-container">
      <h2>Upload and Compress Video</h2>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideoFile(e.target.files[0])}
        disabled={isUploading} // Disable during upload
      />
      <select value={resolution} onChange={(e) => setResolution(e.target.value)} disabled={isUploading}>
        <option value="144p">144p</option>
        <option value="480p">480p</option>
        <option value="720p">720p</option>
        <option value="1080p">1080p</option>
      </select>
      <button onClick={handleCompress} disabled={!videoFile || isUploading}>
        {isUploading ? 'Uploading...' : 'Compress and Download'}
      </button>

      {progress > 0 && (
        <div>
          <p>Compression Progress: {progress}%</p>
          <progress value={progress} max="100"></progress>
        </div>
      )}

      {progress === 100 && downloadLink && (
        <div>
          <a href={`http://localhost:3000${downloadLink}`} download>
            <button>Download Compressed Video</button>
          </a>
          <video controls src={`http://localhost:3000${downloadLink}`} className="video-player"></video>
        </div>
      )}

      <div>
        <h3>CPU Usage Over Time</h3>
        <Line data={cpuData} options={cpuOptions} />
      </div>

      {/* Place the Latest News Marquee at the bottom */}
      <LatestNewsMarquee />
    </div>
  );
}

export default VideoUpload;
