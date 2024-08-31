import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Update to match your server's address

function VideoUpload() {
  const [videoFile, setVideoFile] = useState(null);
  const [resolution, setResolution] = useState('720p');
  const [progress, setProgress] = useState(0);
  const [downloadLink, setDownloadLink] = useState('');

  useEffect(() => {
    socket.on('progress', (data) => {
      setProgress(data.percent);
    });

    return () => {
      socket.off('progress');
    };
  }, []);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
    setDownloadLink('');
    setProgress(0);
  };

  const handleCompress = async () => {
    if (!videoFile) {
      console.error('No video file selected');
      return;
    }

    const token = localStorage.getItem('authToken'); // Get the token from local storage

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('resolution', resolution);

    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the request headers
        },
      });
      setDownloadLink(`http://localhost:3000${response.data.downloadLink}`);
    } catch (err) {
      console.error('Compression failed', err);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload and Compress Video</h2>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <select value={resolution} onChange={(e) => setResolution(e.target.value)}>
        <option value="144p">144p</option>
        <option value="480p">480p</option>
        <option value="720p">720p</option>
        <option value="1080p">1080p</option>
      </select>
      <button onClick={handleCompress} disabled={!videoFile}>
        Compress and Download
      </button>

      {progress > 0 && (
        <div>
          <p>Compression Progress: {progress}%</p>
          <progress value={progress} max="100"></progress>
        </div>
      )}

      {downloadLink && (
        <div>
          <a href={downloadLink} download>
            <button>Download Compressed Video</button>
          </a>
          <video controls src={downloadLink} className="video-player"></video>
        </div>
      )}
    </div>
  );
}

export default VideoUpload;
