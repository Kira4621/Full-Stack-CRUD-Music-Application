// //Toggle between light and dark themes
// function toggleTheme() {
//   document.body.classList.toggle("light");
// }

//Load artists from the database and display them on the page
function loadArtists() {
  fetch("/artists")
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => Promise.reject({ status: response.status, error: err }));
      }
      return response.json();
    })
    .then((data) => {
      const tbody = document.getElementById("artistTableBody");
      tbody.innerHTML = "";

      data.forEach((artist) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${artist.Artist_Name}</td>
          <td>${artist.Genre}</td>
          <td>${artist.Monthly_Listeners}</td>
          <td>
            <button class="btn" onclick="deleteArtist(${artist.Artist_ID})">Delete</button>
            <button class="btn" onclick="editArtist(${artist.Artist_ID}, '${artist.Artist_Name}', '${artist.Genre}', ${artist.Monthly_Listeners})">Edit</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error fetching artists:", error);
      alert(`Failed to load artists (status ${error.status || 'unknown'}).`);
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


//Prefill the edit form with the artist's current data
function editArtist(id, name, genre, listeners) {
  editId = id;

  document.getElementById("editName").value = name;
  document.getElementById("editGenre").value = genre;
  document.getElementById("editListeners").value = listeners;

  toggleDiv("editForm");
}

//Close the edit form and reset the editId
document.getElementById("closeEditForm").addEventListener("click", function () {
  toggleDiv("editForm");
  editId = null;
  document.getElementById("editForm").reset();
});

//Edit an artist by ID
document.getElementById("editForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const artist = {
    Artist_Name: document.getElementById("editName").value,
    Genre: document.getElementById("editGenre").value,
    Monthly_Listeners: document.getElementById("editListeners").value,
  };

  if (!artist.Artist_Name || !artist.Genre || !artist.Monthly_Listeners) {
    alert("Please enter a name, genre, and monthly listeners.");
    return;
  }

  fetch(`/artists/${editId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(artist),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((err) => Promise.reject({ status: res.status, error: err }));
      }
      return res.json();
    })
    .then(() => {
      loadArtists();
      document.getElementById("editForm").reset();
      editId = null;
      toggleDiv("editForm");
    })
    .catch((error) => {
      console.error("Error editing artist:", error);
      alert(`Failed to edit artist (status ${error.status || 'unknown'}). Please try again.`);
    });
});


//Create a new artist
document.getElementById("addForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const artist = {
    Artist_Name: document.getElementById("name").value,
    Genre: document.getElementById("genre").value,
    Monthly_Listeners: document.getElementById("listeners").value,
  };

  if (!artist.Artist_Name || !artist.Genre || !artist.Monthly_Listeners) {
    alert("Please enter a name, genre, and monthly listeners.");
    return;
  }

  fetch("/artists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(artist),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((err) => Promise.reject({ status: res.status, error: err }));
      }
      return res.json();
    })
    .then(() => {
      loadArtists();
      document.getElementById("addForm").reset();
    })
    .catch((error) => {
      console.error("Error creating artist:", error);
      alert(`Failed to create artist (status ${error.status || 'unknown'}). Please try again.`);
    });
});

//Delete an artist by ID
function deleteArtist(id) {
  if (confirm("Are you sure you want to delete this artist?")) {
    fetch(`/artists/${id}`, {
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
      .then(() => loadArtists())
      .catch((error) => {
        console.error("Error deleting artist:", error);
        alert(`Failed to delete artist (status ${error.status || 'unknown'}).`);
      });
  }
}

//Call loadArtists when the page loads
loadArtists();
