import React, { useState } from "react";
import axios from "../axios";

const UploadSongPage = () => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select an MP3 file");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("genre", genre);
    formData.append("file", file); // ✅ MUST be "file"

    try {
      const response = await axios.post("/upload-song/", formData);
      setMessage(`Song "${response.data.song.title}" uploaded successfully!`);

      setTitle("");
      setArtist("");
      setGenre("");
      setFile(null);
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Error uploading song"
      );
    }
  };

  return (
    <div>
      <h2 style={{ color: "#fff", textAlign: "center", marginBottom: "1.5rem" }}>
        Upload Song
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Song Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={inputStyle}
        />

        <input
          type="file"
          accept="audio/mp3,audio/mpeg"
          onChange={handleFileChange}
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Upload
        </button>
      </form>

      {message && (
        <div style={messageStyle(message)}>
          {message}
        </div>
      )}
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "0.6rem",
  marginBottom: "0.6rem",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#282828",
  color: "#fff",
};

const buttonStyle = {
  width: "100%",
  padding: "0.6rem",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#1DB954",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
};

const messageStyle = (msg) => ({
  marginTop: "1rem",
  padding: "0.5rem",
  borderRadius: "6px",
  backgroundColor: msg.toLowerCase().includes("error") ? "#ff4d4d" : "#1DB954",
  color: "#fff",
  textAlign: "center",
});

export default UploadSongPage;
