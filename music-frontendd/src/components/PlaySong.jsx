import React, { useState, useRef } from 'react';
import axios from '../axios';

const PlaySongPage = () => {
  const [songName, setSongName] = useState('');
  const [userId, setUserId] = useState('guest');
  const [message, setMessage] = useState('');
  const [views, setViews] = useState(0);
  const audioRef = useRef(null);

  const handlePlaySong = async () => {
    if (!songName) return setMessage("Enter a song name");

    try {
      const response = await axios.post("/play-song/", {
        user_id: userId,
        song_name: songName
      });

      setMessage(response.data.message);
      setViews(response.data.views);

      if (response.data.file_url) {
        // Play the audio
        if (audioRef.current) {
          audioRef.current.src = response.data.file_url;
          audioRef.current.play();
        }
      }

    } catch (error) {
      setMessage(error.response?.data?.message || "Error playing song");
    }
  };

  return (
    <div style={{ width: '400px', margin: '2rem auto', color: '#fff' }}>
      <h2 style={{ textAlign: 'center' }}>Play Song</h2>
      <input
        type="text"
        placeholder="Song Name"
        value={songName}
        onChange={(e) => setSongName(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#282828', color: '#fff' }}
      />
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#282828', color: '#fff' }}
      />
      <button
        onClick={handlePlaySong}
        style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#1DB954', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
      >
        ▶ Play
      </button>

      {message && <p style={{ marginTop: '1rem', textAlign: 'center', color: '#1DB954' }}>{message}</p>}
      {views > 0 && <p style={{ textAlign: 'center', color: '#fff' }}>Total Views: {views}</p>}

      {/* Hidden audio element */}
      <audio ref={audioRef} controls style={{ width: '100%', marginTop: '1rem' }} />
    </div>
  );
};

export default PlaySongPage;
