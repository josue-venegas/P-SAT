const express = require('express');
const router = express.Router();
const MemeImgFlip = require('../models/memeImgFlip');
const MemeKYM = require('../models/memeKYM');


router.get('/all', async (req, res) => {
  try {
    const imgFlipMemes = await MemeImgFlip.find();
    const kymMemes = await MemeKYM.find();
    
    const imgFlipMemesFiltered = imgFlipMemes.map((meme) => {
      const { title, image_url, gen_description, gen_explanation, gen_fitted_frames } = meme;
      return { name: title, image_url, gen_description, gen_explanation, gen_fitted_frames };
    });

    const kymMemesFiltered = kymMemes.map((meme) => {
      const { name, image_url, gen_description, gen_explanation, gen_fitted_frames } = meme;
      return { name, image_url, gen_description, gen_explanation, gen_fitted_frames };
    });

    res.json([...imgFlipMemesFiltered, ...kymMemesFiltered]);

  } catch (error) {
    console.error('Error retrieving memes:', error);
    res.status(500).json({ error: 'Error retrieving memes', details: error.message });
  }
});

router.get('/memes', async (req, res) => {
  const { frames } = req.query;

  if (!frames) {
    return res.status(400).json({ error: 'No frames specified for search' });
  }

  try {
    const frameArray = Array.isArray(frames) ? frames : frames.split(',');
    const trimmedFrames = frameArray.map((frame) => frame.trim());

    const memesImgFlip = await MemeImgFlip.find({ 'gen_fitted_frames.name': { $all: trimmedFrames } });
    const memesKYM = await MemeKYM.find({ 'gen_fitted_frames.name': { $all: trimmedFrames } });

    const imgFlipMemesFiltered = memesImgFlip.map((meme) => {
      const { title, image_url, gen_description, gen_explanation, gen_fitted_frames } = meme;
      return { name: title, image_url, gen_description, gen_explanation, gen_fitted_frames };
    });

    const kymMemesFiltered = memesKYM.map((meme) => {
      const { name, image_url, gen_description, gen_explanation, gen_fitted_frames } = meme;
      return { name, image_url, gen_description, gen_explanation, gen_fitted_frames };
    });

    const memes = [...imgFlipMemesFiltered, ...kymMemesFiltered];

    if (memes.length === 0) {
      return res.status(404).json({ message: 'No memes found' });
    }

    res.json(memes);
  } catch (error) {
    console.error('Error retrieving memes:', error);
    res.status(500).json({ error: 'Error retrieving memes', details: error.message });
  }
});



module.exports = router;
