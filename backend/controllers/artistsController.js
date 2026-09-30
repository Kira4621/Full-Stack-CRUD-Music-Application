const db = require("../db");

//GET all artists

exports.getAllArtists = (req, res) => {
    db.all("SELECT * FROM artists", [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(rows);
    });
};

//GET one artist by ID
exports.getArtistById = (req, res) => {
    const { id } = req.params;

    db.get("SELECT * FROM artists WHERE Artist_ID = ?", [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Artist not found" });
        res.status(200).json(row);
    });
};

//Create one artist
exports.createArtist = (req, res) => {
    const { Artist_Name, Genre, Monthly_Listeners } = req.body;

    if (!Artist_Name || !Genre || !Monthly_Listeners) {
        return res.status(400).json({ error: "Artist_Name, Genre, and Monthly_Listeners are required" });
    }

    const sql = "INSERT INTO artists (Artist_Name, Genre, Monthly_Listeners) VALUES (?, ?, ?)";

    db.run(sql, [Artist_Name, Genre, Monthly_Listeners], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ Artist_ID: this.lastID });
    });
};

//Update one artist by ID
exports.updateArtist = (req, res) => {
    const { id } = req.params;
    const { Artist_Name, Genre, Monthly_Listeners } = req.body;

    const sql = "UPDATE artists SET Artist_Name = ?, Genre = ?, Monthly_Listeners = ? WHERE Artist_ID = ?";

    db.run(sql, [Artist_Name, Genre, Monthly_Listeners, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) 
            return res.status(404).json({ error: "Artist not found" });
        res.status(200).json({ Artist_ID: id, Artist_Name, Genre, Monthly_Listeners });
    });
};

//Delete one artist by ID
exports.deleteArtist = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM artists WHERE Artist_ID = ?";

    db.run(sql, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0)
            return res.status(404).json({ error: "Artist not found" });
        res.status(204).json({ message: "Artist deleted successfully"});
    });
};