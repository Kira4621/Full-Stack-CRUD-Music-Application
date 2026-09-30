// //Toggle between light and dark themes
// function toggleTheme() {
//   document.body.classList.toggle("light");
// }

function loadSongs() {
  fetch("/songs")
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => Promise.reject({ status: response.status, error: err }));
      }
      return response.json();
    })
    .then((data) => {
      const tbody = document.getElementById("songTableBody");
      tbody.innerHTML = "";

      data.forEach((song) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${song.Song_Name}</td>
          <td>${song.Release_Year}</td>
          <td>${song.Album_ID}</td>
          <td>
            <button class="btn" onclick="deleteSong(${song.Song_ID})">Delete</button>
            <button class="btn" onclick="editSong(${song.Song_ID}, '${song.Song_Name}', ${song.Release_Year}, ${song.Album_ID})">Edit</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error fetching songs:", error);
      alert(`Failed to load songs (status ${error.status || 'unknown'}).`);
    });
}

let editId = null;
const editForm = document.getElementById("editForm");

//Toggle visibility of a div
function toggleDiv(divId) {
  const hiddenDiv = document.getElementById(divId);
  hiddenDiv.style.display =
    hiddenDiv.style.display === "none" || hiddenDiv.style.display === ""
      ? "block"
      : "none";
}


//Prefill the edit form with the song's current data
function editSong(id, name, releaseYear, albumId) {
  editId = id;

  document.getElementById("editName").value = name;
  document.getElementById("editReleaseYear").value = releaseYear;
  document.getElementById("editAlbumId").value = albumId;

  toggleDiv("editForm");
}

//Edit a song by ID
document.getElementById("editForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const song = {
    Song_Name: document.getElementById("editName").value,
    Release_Year: document.getElementById("editReleaseYear").value,
    Album_ID: document.getElementById("editAlbumId").value,
  };

  if (!song.Song_Name || !song.Release_Year || !song.Album_ID) {
    alert("Please enter a name, release year, and album ID.");
    return;
  }

  fetch(`/songs/${editId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(song),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((err) => Promise.reject({ status: res.status, error: err }));
      }
      return res.json();
    })
    .then(() => {
      loadSongs();
      document.getElementById("editForm").reset();
      editId = null;
      toggleDiv("editForm");
    })
    .catch((error) => {
      console.error("Error editing song:", error);
      alert(`Failed to edit song (status ${error.status || 'unknown'}). Please try again.`);
    });
});


//Create a new song
document.getElementById("addForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const song = {
    Song_Name: document.getElementById("name").value,
    Release_Year: document.getElementById("releaseYear").value,
    Album_ID: document.getElementById("albumId").value,
  };

  if (!song.Song_Name || !song.Release_Year || !song.Album_ID) {
    alert("Please enter a song name, release year, and album ID.");
    return;
  }

  fetch("/songs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(song),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((err) => Promise.reject({ status: res.status, error: err }));
      }
      return res.json();
    })
    .then(() => {
      loadSongs();
      document.getElementById("addForm").reset();
    })
    .catch((error) => {
      console.error("Error creating song:", error);
      alert(`Failed to create song (status ${error.status || 'unknown'}). Please try again.`);
    });
});

function deleteSong(id) {
  if (confirm("Are you sure you want to delete this song?")) {
    fetch(`/songs/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => Promise.reject({ status: res.status, error: err }));
        }
        if (res.status === 204) {
          return null;
        }
        return res.json();
      })
      .then(() => loadSongs())
      .catch((error) => {
        console.error("Error deleting song:", error);
        alert(`Failed to delete song (status ${error.status || 'unknown'}).`);
      });
  }
}

loadSongs();
