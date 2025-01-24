const express = require('express');
const router = express.Router();
const MemeImgFlip = require('../models/memeImgFlip');
const MemeKYM = require('../models/memeKYM');


router.get('/all', async (req, res) => {
  try {
    const imgFlipMemes = await MemeImgFlip.find();
    const kymMemes = await MemeKYM.find();
    
    const imgFlipMemesFiltered = imgFlipMemes.map((meme) => {
      const { title, template_title, image_url } = meme;
      return { name: title, template_name: template_title, image_url, origin: 'imgflip', _id: meme._id };
    });

    const kymMemesFiltered = kymMemes.map((meme) => {
      const { name, image_url } = meme;
      return { name, template_name: name, image_url, origin: 'kym', _id: meme._id };
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

    const imgFlipMemes = await MemeImgFlip.find({ 'gen_fitted_frames.name': { $all: trimmedFrames } });
    const kymMemes = await MemeKYM.find({ 'gen_fitted_frames.name': { $all: trimmedFrames } });

    const imgFlipMemesFiltered = imgFlipMemes.map((meme) => {
      const { title, template_title, image_url } = meme;
      return { name: title, template_name: template_title, image_url, origin: 'imgflip', _id: meme._id };
    });

    const kymMemesFiltered = kymMemes.map((meme) => {
      const { name, image_url } = meme;
      return { name, template_name: name, image_url, origin: 'kym', _id: meme._id };
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

router.get('/meme/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const imgFlipMeme = await MemeImgFlip.findById(id);
    if (imgFlipMeme) {
      const { title, template_title, image_url, gen_description, gen_explanation, gen_fitted_frames } = imgFlipMeme;
      return res.json({ name: title, template_name: template_title, image_url, origin: 'imgflip', _id: imgFlipMeme._id, gen_description, gen_explanation, gen_fitted_frames });
    }

    const kymMeme = await MemeKYM.findById(id);
    if (kymMeme) {
      const { name, image_url, gen_description, gen_explanation, gen_fitted_frames } = kymMeme;
      return res.json({ name, template_name: name, image_url, origin: 'kym', _id: kymMeme._id, gen_description, gen_explanation, gen_fitted_frames });
    }

    res.status(404).json({ message: 'Meme not found' });
  } catch (error) {
    console.error('Error retrieving meme:', error);
    res.status(500).json({ error: 'Error retrieving meme', details: error.message });
  }
});

module.exports = router;
