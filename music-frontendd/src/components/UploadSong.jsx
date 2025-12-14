import React, { useState } from 'react';
import axios from '../axios';

const UploadSongPage = () => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('genre', genre);
    formData.append('audio_file', file);

    try {
      const response = await axios.post('/upload-song/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(`Song "${response.data.song.title}" uploaded successfully!`);
      setTitle('');
      setArtist('');
      setGenre('');
      setFile(null);
    } catch (error) {
      setMessage(`Error uploading song: ${error.response?.data?.error || 'Unknown error'}`);
    }
  };

  return (
    <div>
      <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '1.5rem' }}>Upload Song</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Song Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '0.5rem',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#282828',
            color: '#fff',
          }}
        />
        <input
          type="text"
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '0.5rem',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#282828',
            color: '#fff',
          }}
        />
        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '0.5rem',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#282828',
            color: '#fff',
          }}
        />
        <input
          type="file"
          accept="audio/mp3"
          onChange={handleFileChange}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '0.5rem',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#282828',
            color: '#fff',
          }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#1DB954',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Upload
        </button>
      </form>
      {message && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.5rem',
            borderRadius: '6px',
            backgroundColor: message.includes('Error') ? '#ff4d4d' : '#1DB954',
            color: '#fff',
            textAlign: 'center',
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default UploadSongPage;
