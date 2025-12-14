import React, { useState } from "react";
import api from "../axios";
import { FaLink } from "react-icons/fa";

const RelatedSongs = () => {
  const [songName, setSongName] = useState("");
  const [relatedSongs, setRelatedSongs] = useState([]);

  const fetchRelatedSongs = async () => {
    if (!songName) return;
    try {
      const response = await api.post("/related-songs/", { song_name: songName });
      setRelatedSongs(response.data.related_songs);
    } catch (error) {
      console.error("Error fetching related songs:", error);
    }
  };

  return (
    <div>
      <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '1rem' }}>Related Songs</h2>
      <div style={{ display: 'flex', marginBottom: '1rem', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Enter Song Name"
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
          style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#282828', color: '#fff' }}
        />
        <button
          onClick={fetchRelatedSongs}
          style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', backgroundColor: '#1DB954', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Fetch
        </button>
      </div>
      <div>
        {relatedSongs.map((song) => (
          <div key={song._id} style={{ backgroundColor: '#282828', padding: '0.8rem', borderRadius: '6px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{song.title} - {song.artist}</span>
            <FaLink style={{ color: '#1DB954' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedSongs;
