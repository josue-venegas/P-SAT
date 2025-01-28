const express = require('express');
const router = express.Router();
/* const MemeImgFlip = require('../models/memeImgFlip');
const MemeRedditEs = require('../models/memeRedditEs');
const MemeRedditFr = require('../models/memeRedditFr'); */
const LocalMemesEn = require('../models/localMemesEn');
const LocalMemesEs = require('../models/localMemesEs');
const LocalMemesFr = require('../models/localMemesFr');

router.get('/allmemes', async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;
  
      // Fetch data from memes collection
      /* const imgFlipMemes = await MemeImgFlip.find().lean();
      const redditSpanishMemes = await MemeRedditEs.find().lean();
      const redditFrenchMemes = await MemeRedditFr.find().lean(); */
      const localMemesEn = await LocalMemesEn.find().lean();
      const localMemesEs = await LocalMemesEs.find().lean();
      const localMemesFr = await LocalMemesFr.find().lean();
  
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
        origin: 'reddit-french',
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
  
      // Combine the memes
      // const combinedMemes = [...imgFlipMemesFiltered, ...redditSpanishMemesFiltered, ...redditFrenchMemesFiltered];
      const combinedMemes = [...localMemesEnFiltered, ...localMemesEsFiltered, ...localMemesFrFiltered];
  
      // Pagination logic
      const paginatedMemes = combinedMemes.slice(skip, skip + parseInt(limit));
  
      // Total memes count
      // const totalMemes = imgFlipMemes.length + redditSpanishMemes.length + redditFrenchMemes.length;
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