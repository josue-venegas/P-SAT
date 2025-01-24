const express = require('express');
const router = express.Router();
const MemeKYM = require('../models/memeKYM');

router.get('/downloadTemplatesJSON', async (req, res) => {
  try {
    // Fetch the data using the aggregation pipeline
    const data = await MemeKYM.aggregate([
      {
        $project: {
          _id: 0, // Exclude the `_id` field (optional)
          name: 1,
          gen_fitted_frames: {
            $map: {
              input: "$gen_fitted_frames",
              as: "frame",
              in: "$$frame.name", // Extract only the `name` field as a string
            },
          },
        },
      },
    ]);

    // Set the appropriate headers for JSON file download
    res.setHeader("Content-Disposition", "attachment; filename=memes.json");
    res.setHeader("Content-Type", "application/json");

    // Send the JSON data as a file
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;