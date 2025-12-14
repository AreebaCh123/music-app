import React, { useState } from 'react';
import axios from '../axios';

const RecentlyPlayedSongs = () => {
  const [userId, setUserId] = useState('guest');
  const [songs, setSongs] = useState([]);

  const fetchRecentSongs = async () => {
    try {
      const response = await axios.get(`/recent/${userId}/`);
      setSongs(response.data.recent);
    } catch (error) {
      console.error('Error fetching recent songs:', error);
    }
  };

  return (
    <div>
      <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '1rem' }}>Recently Played</h2>
      <div style={{ display: 'flex', marginBottom: '1rem', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#282828', color: '#fff' }}
        />
        <button
          onClick={fetchRecentSongs}
          style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', backgroundColor: '#1DB954', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Fetch
        </button>
      </div>
      <div>
        {songs.map((song) => (
          <div key={song._id} style={{ backgroundColor: '#282828', padding: '0.8rem', borderRadius: '6px', marginBottom: '0.5rem' }}>
            <strong>{song.title}</strong> - {song.artist}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyPlayedSongs;
