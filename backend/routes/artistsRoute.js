const express = require("express");
const router = express.Router();
const artistsController = require("../controllers/artistsController");


//CRUD routes for artists

//GET all artists
router.get("/", artistsController.getAllArtists);


//GET one artist by ID
router.get("/:id", artistsController.getArtistById);

//Create one artist
router.post("/", artistsController.createArtist);

//Update one artist by ID
router.put("/:id", artistsController.updateArtist);

//Delete one artist by ID
router.delete("/:id", artistsController.deleteArtist);

module.exports = router;