const API_BASE = "http://127.0.0.1:8000"; // Django backend

// ------------------- Upload Song -------------------
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const res = await fetch(`${API_BASE}/upload-song/`, {
        method: "POST",
        body: formData
    });

    const data = await res.json();
    document.getElementById("uploadResult").innerText = JSON.stringify(data, null, 2);
});

// ------------------- Play Song -------------------
document.getElementById("playSongBtn").addEventListener("click", async () => {
    const songId = document.getElementById("playSongId").value;
    const userId = document.getElementById("userId").value || "guest";

    const res = await fetch(`${API_BASE}/play-song/${songId}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
    });

    const data = await res.json();
    document.getElementById("playResult").innerText = JSON.stringify(data, null, 2);
});

// ------------------- Recent Songs -------------------
document.getElementById("recentBtn").addEventListener("click", async () => {
    const userId = document.getElementById("recentUserId").value;

    const res = await fetch(`${API_BASE}/recent/${userId}/`);
    const data = await res.json();

    const ul = document.getElementById("recentList");
    ul.innerHTML = "";
    data.recent.forEach(song => {
        const li = document.createElement("li");
        li.textContent = `${song.title} by ${song.artist}`;
        ul.appendChild(li);
    });
});

// ------------------- Related Songs -------------------
document.getElementById("relatedBtn").addEventListener("click", async () => {
    const songId = document.getElementById("relatedSongId").value;

    const res = await fetch(`${API_BASE}/related-songs/${songId}/`);
    const data = await res.json();

    const ul = document.getElementById("relatedList");
    ul.innerHTML = "";
    data.related_songs.forEach(song => {
        const li = document.createElement("li");
        li.textContent = `${song.title} by ${song.artist}`;
        ul.appendChild(li);
    });
});
