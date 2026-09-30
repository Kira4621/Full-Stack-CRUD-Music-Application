const db = require("../db");

//GET all songs

exports.getAllSongs = (req, res) => {
    db.all("SELECT * FROM songs", [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(rows);
    });
};

//GET one song by ID
exports.getSongById = (req, res) => {
    const { id } = req.params;

    db.get("SELECT * FROM songs WHERE Song_ID = ?", [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Song not found" });
        res.status(200).json(row);
    });
};

//Create one song
exports.createSong = (req, res) => {
    const { Song_Name, Release_Year, Album_ID } = req.body;

    if (!Song_Name || !Release_Year || !Album_ID) {
        return res.status(400).json({ error: "Song_Name, Release_Year, and Album_ID are required" });
    }

    const sql = "INSERT INTO songs (Song_Name, Release_Year, Album_ID) VALUES (?, ?, ?)";

    db.run(sql, [Song_Name, Release_Year, Album_ID], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ Song_ID: this.lastID });
    });
};

//Update one song by ID
exports.updateSong = (req, res) => {
    const { id } = req.params;
    const { Song_Name, Release_Year, Album_ID } = req.body;

    const sql = "UPDATE songs SET Song_Name = ?, Release_Year = ?, Album_ID = ? WHERE Song_ID = ?";

    db.run(sql, [Song_Name, Release_Year, Album_ID, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) 
            return res.status(404).json({ error: "Song not found" });
        res.status(200).json({ Song_Name, Release_Year, Album_ID, id });
    });
};

//Delete one song by ID
exports.deleteSong = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM songs WHERE Song_ID = ?";

    db.run(sql, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0)
            return res.status(404).json({ error: "Song not found" });
        res.status(204).json({ message: "Song deleted successfully"});
    });
};