const express = require("express");
const router = express.Router();
const songsController = require("../controllers/songsController");


//CRUD routes for songs

//GET all songs
router.get("/", songsController.getAllSongs);

//GET one song by ID
router.get("/:id", songsController.getSongById);

//Create one song
router.post("/", songsController.createSong);

//Update one song by ID
router.put("/:id", songsController.updateSong);

//Delete one song by ID
router.delete("/:id", songsController.deleteSong);

module.exports = router;