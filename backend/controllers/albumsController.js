const db = require("../db");

//GET all albums

exports.getAllAlbums = (req, res) => {
    db.all("SELECT * FROM albums", [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(rows);
    });
};

//GET one album by ID
exports.getAlbumById = (req, res) => {
    const { id } = req.params;

    db.get("SELECT * FROM albums WHERE Album_ID = ?", [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Album not found" });
        res.status(200).json(row);
    });
};

//Create one album
exports.createAlbum = (req, res) => {
    const { Album_Name, Release_Year, Number_Of_Listens, Artist_ID } = req.body;

    if (!Album_Name || !Release_Year || !Number_Of_Listens || !Artist_ID) {
        return res.status(400).json({ error: "Album_Name, Release_Year, Number_Of_Listens, and Artist_ID are required" });
    }

    const sql = "INSERT INTO albums (Album_Name, Release_Year, Number_Of_Listens, Artist_ID) VALUES (?, ?, ?, ?)";

    db.run(sql, [Album_Name, Release_Year, Number_Of_Listens, Artist_ID], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ Album_ID: this.lastID });
    });
};

//Update one album by ID
exports.updateAlbum = (req, res) => {
    const { id } = req.params;
    const { Album_Name, Release_Year, Number_Of_Listens, Artist_ID } = req.body;

    const sql = "UPDATE albums SET Album_Name = ?, Release_Year = ?, Number_Of_Listens = ?, Artist_ID = ? WHERE Album_ID = ?";

    db.run(sql, [Album_Name, Release_Year, Number_Of_Listens, Artist_ID, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) 
            return res.status(404).json({ error: "Album not found" });
        res.status(200).json({ Album_Name, Release_Year, Number_Of_Listens, Artist_ID, id });
    });
};

//Delete one album by ID
exports.deleteAlbum = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM albums WHERE Album_ID = ?";

    db.run(sql, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0)
            return res.status(404).json({ error: "Album not found" });
        res.status(204).json({ message: "Album deleted successfully"});
    });
};