const express = require('express');
const router = express.Router();
const MemeImgFlip = require('../models/memeImgFlip');

router.get('/downloadMemesJSON', async (req, res) => {
    try {
      // Fetch the data using the aggregation pipeline
      const data = await MemeImgFlip.aggregate([
        {
          $project: {
            _id: 0, // Exclude the `_id` field (optional)
            title: 1,
            template_title: 1,
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
  
      // Map the key names
      const mappedData = data.map((meme) => ({
        name: meme.title,
        template_name: meme.template_title,
        gen_fitted_frames: meme.gen_fitted_frames,
      }));
  
      // Send the JSON data as a file
      res.json(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;