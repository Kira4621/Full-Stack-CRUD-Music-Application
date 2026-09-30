// //Toggle between light and dark themes
// function toggleTheme() {
//   document.body.classList.toggle("light");
// }

function loadAlbums() {
  fetch("/albums")
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => Promise.reject({ status: response.status, error: err }));
      }
      return response.json();
    })
    .then((data) => {
      const tbody = document.getElementById("albumTableBody");
      tbody.innerHTML = "";

      data.forEach((album) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${album.Album_Name}</td>
          <td>${album.Release_Year}</td>
          <td>${album.Number_Of_Listens}</td>
          <td>
            <button class="btn" onclick="deleteAlbum(${album.Album_ID})">Delete</button>
            <button class="btn" onclick="editAlbum(${album.Album_ID}, '${album.Album_Name}', ${album.Release_Year}, ${album.Number_Of_Listens}, ${album.Artist_ID})">Edit</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error fetching albums:", error);
      alert(`Failed to load albums (status ${error.status || 'unknown'}).`);
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


//Prefill the edit form with the album's current data
function editAlbum(id, name, releaseYear, listens, artistId) {
  editId = id;

  document.getElementById("editName").value = name;
  document.getElementById("editReleaseYear").value = releaseYear;
  document.getElementById("editListens").value = listens;
  document.getElementById("editArtistId").value = artistId;

  toggleDiv("editForm");
}

//Edit an album by ID
document.getElementById("editForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const album = {
    Album_Name: document.getElementById("editName").value,
    Release_Year: document.getElementById("editReleaseYear").value,
    Number_Of_Listens: document.getElementById("editListens").value,
    Artist_ID: document.getElementById("editArtistId").value,
  };

  if (!album.Album_Name || !album.Release_Year || !album.Number_Of_Listens || !album.Artist_ID) {
    alert("Please enter an album name, release year, number of listens, and artist ID.");
    return;
  }

  fetch(`/albums/${editId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(album),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((err) => Promise.reject({ status: res.status, error: err }));
      }
      return res.json();
    })
    .then(() => {
      loadAlbums();
      document.getElementById("editForm").reset();
      editId = null;
      toggleDiv("editForm");
    })
    .catch((error) => {
      console.error("Error editing album:", error);
      alert(`Failed to edit album (status ${error.status || 'unknown'}). Please try again.`);
    });
});


//Create a new album
document.getElementById("addForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const album = {
    Album_Name: document.getElementById("name").value,
    Release_Year: document.getElementById("releaseYear").value,
    Number_Of_Listens: document.getElementById("listens").value,
    Artist_ID: document.getElementById("artistId").value,
  };

  if (!album.Album_Name || !album.Release_Year || !album.Number_Of_Listens || !album.Artist_ID) {
    alert("Please enter an album name, release year, number of listens, and artist ID.");
    return;
  }

  fetch("/albums", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(album),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((err) => Promise.reject({ status: res.status, error: err }));
      }
      return res.json();
    })
    .then(() => {
      loadAlbums();
      document.getElementById("addForm").reset();
    })
    .catch((error) => {
      console.error("Error creating album:", error);
      alert(`Failed to create album (status ${error.status || 'unknown'}). Please try again.`);
    });
});

function deleteAlbum(id) {
  if (confirm("Are you sure you want to delete this album?")) {
    fetch(`/albums/${id}`, {
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
      .then(() => loadAlbums())
      .catch((error) => {
        console.error("Error deleting album:", error);
        alert(`Failed to delete album (status ${error.status || 'unknown'}).`);
      });
  }
}

//Call loadAlbums on page load to display albums
loadAlbums();
