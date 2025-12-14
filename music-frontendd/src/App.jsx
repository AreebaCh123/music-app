import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UploadSongPage from "./components/UploadSong";
import PlaySongPage from "./components/PlaySong";
import RecentlyPlayedSongs from "./components/RecentSongs";
import RelatedSongs from "./components/RelatedSongs";

const App = () => {
  const styles = {
    container: {
      backgroundColor: "#121212",
      color: "#fff",
      minHeight: "100vh",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      display: "flex",
    },
    sidebar: {
      width: "200px",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    link: {
      padding: "0.5rem",
      color: "#fff",
      textDecoration: "none",
      borderRadius: "6px",
      backgroundColor: "#1e1e1e",
      textAlign: "center",
    },
    linkActive: {
      backgroundColor: "#1DB954",
    },
    main: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      width: "400px",
      padding: "2rem",
      borderRadius: "1rem",
      backgroundColor: "#1e1e1e",
      boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
    },
    logo: {
      display: "block",
      margin: "0 auto 1rem",
      width: "100px",
    },
  };

  return (
    <Router>
      <div style={styles.container}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <Link to="/" style={styles.link}>Upload</Link>
          <Link to="/play" style={styles.link}>Play Song</Link>
          <Link to="/recent" style={styles.link}>Recently Played</Link>
          <Link to="/related" style={styles.link}>Related Songs</Link>
        </div>

        {/* Main Content */}
        <div style={styles.main}>
          <div style={styles.card}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/1024px-Spotify_logo_with_text.svg.png"
              alt="Spotify Logo"
              style={styles.logo}
            />
            <Routes>
              <Route path="/" element={<UploadSongPage />} />
              <Route path="/play" element={<PlaySongPage />} />
              <Route path="/recent" element={<RecentlyPlayedSongs />} />
              <Route path="/related" element={<RelatedSongs />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
