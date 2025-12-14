import React, { useState } from 'react';
import axios from '../axios';

const PlaySongPage = () => {
  const [songId, setSongId] = useState('');
  const [userId, setUserId] = useState('guest');
  const [message, setMessage] = useState('');
  const [views, setViews] = useState(0);

  const handlePlaySong = async () => {
    try {
      const response = await axios.post(`/play-song/${songId}/`, { user_id: userId });
      setMessage(response.data.message);
      setViews(response.data.views);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error playing song');
    }
  };

  return (
    <div>
      <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '1rem' }}>Play Song</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Song ID"
          value={songId}
          onChange={(e) => setSongId(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#282828', color: '#fff' }}
        />
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#282828', color: '#fff' }}
        />
      </div>
      <button
        onClick={handlePlaySong}
        style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#1DB954', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
      >
        ▶ Play
      </button>
      {message && (
        <p style={{ marginTop: '1rem', color: '#1DB954', textAlign: 'center' }}>{message}</p>
      )}
      {views > 0 && <p style={{ marginTop: '0.5rem', textAlign: 'center', color: '#fff' }}>Total Views: {views}</p>}
    </div>
  );
};

export default PlaySongPage;
