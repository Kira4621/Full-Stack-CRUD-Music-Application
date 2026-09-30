const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const db = require("./db");

app.use(cors());
app.use(express.json());

const path = require("path");

// serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

//import routes
const artistsRoute = require("./routes/artistsRoute");
const albumsRoute = require("./routes/albumsRoute");
const songsRoute = require("./routes/songsRoute");

//register routes
app.use("/artists", artistsRoute);
app.use("/albums", albumsRoute);
app.use("/songs", songsRoute);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});