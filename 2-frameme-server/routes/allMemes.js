const express = require('express');
const router = express.Router();
const MemeImgFlip = require('../models/memeImgFlip');
const MemeRedditEs = require('../models/memeRedditEs');

router.get('/allmemes', async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;
  
      // Fetch data from memes collection
      const imgFlipMemes = await MemeImgFlip.find().lean();
      const redditSpanishMemes = await MemeRedditEs.find().lean();
  
      const imgFlipMemesFiltered = imgFlipMemes.map((meme) => ({
        name: meme.title,
        template_name: meme.template_title,
        image_url: meme.image_url,
        gen_fitted_frames: meme.gen_fitted_frames,
        origin: 'imgflip',
        _id: meme._id,
      }));

      const redditSpanishMemesFiltered = redditSpanishMemes.map((meme) => ({
        image_url: meme.url,
        gen_fitted_frames: meme.gen_fitted_frames,
        origin: 'reddit-spanish',
        _id: meme._id,
      }));
  
      // Combine the memes
      const combinedMemes = [...imgFlipMemesFiltered, ...redditSpanishMemesFiltered];
  
      // Pagination logic
      const paginatedMemes = combinedMemes.slice(skip, skip + parseInt(limit));
  
      // Total memes count
      const totalMemes = imgFlipMemes.length + redditSpanishMemes.length;
  
      res.json({
        memes: paginatedMemes,
        totalPages: Math.ceil(totalMemes / limit),
        currentPage: parseInt(page),
      });
    } catch (error) {
      console.error('Error retrieving memes:', error);
      res.status(500).json({ error: 'Error retrieving memes', details: error.message });
    }
});

module.exports = router;