const express = require('express');
const router = express.Router();
/* const MemeImgFlip = require('../models/memeImgFlip');
const MemeRedditEs = require('../models/memeRedditEs');
const MemeRedditFr = require('../models/memeRedditFr'); */
const LocalMemesEn = require('../models/localMemesEn');
const LocalMemesEs = require('../models/localMemesEs');
const LocalMemesFr = require('../models/localMemesFr');

router.get('/memes', async (req, res) => {
    const { frames, page = 1, limit = 10, mode = 'all' } = req.query;
    const skip = (page - 1) * limit;
  
    if (!frames) {
      return res.status(400).json({ error: 'No frames specified for search' });
    }
  
    try {
      const frameArray = frames.split(',').map((frame) => frame.trim());
      let query;
  
      switch (mode) {
        case 'any':
          query = { 'gen_fitted_frames.name': { $in: frameArray } }; // Matches at least one frame
          break;
        case 'all':
          query = { 'gen_fitted_frames.name': { $all: frameArray } }; // Matches all frames
          break;
        case 'exact':
          query = { 'gen_fitted_frames.name': { $all: frameArray, $size: frameArray.length } }; // Matches exactly the given frames
          break;
        default:
          return res.status(400).json({ error: 'Invalid mode specified' });
      }
  
      // Fetch data from memes collection based on the query
      /* const imgFlipMemes = await MemeImgFlip.find(query).lean();
      const redditSpanishMemes = await MemeRedditEs.find(query).lean();
      const redditFrenchMemes = await MemeRedditFr.find(query).lean(); */
      const localMemesEs = await LocalMemesEs.find(query).lean();
      const localMemesEn = await LocalMemesEn.find(query).lean();
      const localMemesFr = await LocalMemesFr.find(query).lean();
  
      /* const imgFlipMemesFiltered = imgFlipMemes.map((meme) => ({
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

      const redditFrenchMemesFiltered = redditFrenchMemes.map((meme) => ({
        image_url: meme.url,
        gen_fitted_frames: meme.gen_fitted_frames,
        origin: 'reddit-spanish',
        _id: meme._id,
      })); */

      const localMemesEnFiltered = localMemesEn.map((meme) => ({
        name: meme.name,
        template_name: meme.template_name,
        image_url: meme.url,
        gen_description: meme.gen_description,
        gen_explanation: meme.gen_explanation,
        gen_fitted_frames: meme.gen_fitted_frames,
        origin: 'local-en',
        _id: meme._id,
      }));

      const localMemesEsFiltered = localMemesEs.map((meme) => ({
        name: meme.name,
        template_name: meme.template_name,
        image_url: meme.url,
        gen_description: meme.gen_description,
        gen_explanation: meme.gen_explanation,
        gen_fitted_frames: meme.gen_fitted_frames,
        origin: 'local-es',
        _id: meme._id,
      }));

      const localMemesFrFiltered = localMemesFr.map((meme) => ({
        name: meme.name,
        template_name: meme.template_name,
        image_url: meme.url,
        gen_description: meme.gen_description,
        gen_explanation: meme.gen_explanation,
        gen_fitted_frames: meme.gen_fitted_frames,
        origin: 'local-fr',
        _id: meme._id,
      }));
  
      //const combinedMemes = [...imgFlipMemesFiltered, ...redditSpanishMemesFiltered, ...redditFrenchMemesFiltered];
      const combinedMemes = [...localMemesEnFiltered, ...localMemesEsFiltered, ...localMemesFrFiltered];
      const paginatedMemes = combinedMemes.slice(skip, skip + parseInt(limit));
  
      //const totalMemes = imgFlipMemes.length + redditSpanishMemes.length + redditFrenchMemes.length;
      const totalMemes = localMemesEn.length + localMemesEs.length + localMemesFr.length;
  
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