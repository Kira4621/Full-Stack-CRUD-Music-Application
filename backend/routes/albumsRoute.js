const express = require("express");
const router = express.Router();
const albumsController = require("../controllers/albumsController");


//CRUD routes for albums

//GET all albums
router.get("/", albumsController.getAllAlbums);

//GET one album by ID
router.get("/:id", albumsController.getAlbumById);

//Create one album
router.post("/", albumsController.createAlbum);

//Update one album by ID
router.put("/:id", albumsController.updateAlbum);

//Delete one album by ID
router.delete("/:id", albumsController.deleteAlbum);

module.exports = router;