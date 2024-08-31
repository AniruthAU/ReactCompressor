import React, { useState } from 'react';
import axios from 'axios';

const VideoUpload = () => {
  const [video, setVideo] = useState(null);
  const [resolution, setResolution] = useState('720p');
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('video', video);
    formData.append('resolution', resolution);

    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        },
      });
      alert('Upload successful! Download here: ' + response.data.downloadLink);
    } catch (error) {
      alert('Upload failed: ' + error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Upload Video</h2>
      <input type="file" onChange={(e) => setVideo(e.target.files[0])} />
      <select value={resolution} onChange={(e) => setResolution(e.target.value)}>
        <option value="144p">144p</option>
        <option value="480p">480p</option>
        <option value="720p">720p</option>
        <option value="1080p">1080p</option>
      </select>
      <button onClick={handleUpload}>Upload</button>
      {progress > 0 && <div>Upload Progress: {progress}%</div>}
    </div>
  );
};

export default VideoUpload;
