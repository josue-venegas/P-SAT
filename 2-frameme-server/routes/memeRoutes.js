const express = require('express');
const router = express.Router();
const MemeImgFlip = require('../models/memeImgFlip');
const MemeKYM = require('../models/memeKYM');


router.get('/all', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Fetch data from both collections
    const imgFlipMemes = await MemeImgFlip.find().lean();
    const kymMemes = await MemeKYM.find().lean();

    // Filter the memes for output format
    const imgFlipMemesFiltered = imgFlipMemes.map((meme) => {
      const { title, template_title, image_url } = meme;
      return { name: title, template_name: template_title, image_url, origin: 'imgflip', _id: meme._id };
    });

    const kymMemesFiltered = kymMemes.map((meme) => {
      const { name, image_url } = meme;
      return { name, template_name: name, image_url, origin: 'kym', _id: meme._id };
    });

    // Combine the memes
    const combinedMemes = [...imgFlipMemesFiltered, ...kymMemesFiltered];

    // Pagination logic
    const paginatedMemes = combinedMemes.slice(skip, skip + parseInt(limit));

    // Total memes count
    const totalMemes = imgFlipMemes.length + kymMemes.length;

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

router.get('/memes', async (req, res) => {
  const { frames, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  if (!frames) {
    return res.status(400).json({ error: 'No frames specified for search' });
  }

  try {
    const frameArray = frames.split(',').map((frame) => frame.trim());

    // Fetch data from both collections based on the frames filter
    const imgFlipMemes = await MemeImgFlip.find({ 'gen_fitted_frames.name': { $all: frameArray } }).lean();
    const kymMemes = await MemeKYM.find({ 'gen_fitted_frames.name': { $all: frameArray } }).lean();

    // Filter the memes for output format
    const imgFlipMemesFiltered = imgFlipMemes.map((meme) => ({
      name: meme.title,
      template_name: meme.template_title,
      image_url: meme.image_url,
      origin: 'imgflip',
      _id: meme._id,
    }));

    const kymMemesFiltered = kymMemes.map((meme) => ({
      name: meme.name,
      template_name: meme.name,
      image_url: meme.image_url,
      origin: 'kym',
      _id: meme._id,
    }));

    // Combine the memes from both collections
    const combinedMemes = [...imgFlipMemesFiltered, ...kymMemesFiltered];

    // Pagination logic
    const paginatedMemes = combinedMemes.slice(skip, skip + parseInt(limit));

    // Total memes count after filtering
    const totalImgFlipMemes = imgFlipMemes.length;
    const totalKymMemes = kymMemes.length;
    const totalMemes = totalImgFlipMemes + totalKymMemes;

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
      const { name, description, image_url, gen_description, gen_explanation, gen_fitted_frames } = kymMeme;
      return res.json({ name, template_name: name, description, image_url, origin: 'kym', _id: kymMeme._id, gen_description, gen_explanation, gen_fitted_frames });
    }

    res.status(404).json({ message: 'Meme not found' });
  } catch (error) {
    console.error('Error retrieving meme:', error);
    res.status(500).json({ error: 'Error retrieving meme', details: error.message });
  }
});

module.exports = router;
