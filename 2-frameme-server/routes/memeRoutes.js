const express = require('express');
const router = express.Router();
const MemeImgFlip = require('../models/memeImgFlip');
const MemeKYM = require('../models/memeKYM');

router.get('/allmemes', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Fetch data from memes collection
    const imgFlipMemes = await MemeImgFlip.find().lean();

    // Filter the memes for output format
    const imgFlipMemesFiltered = imgFlipMemes.map((meme) => ({
      name: meme.title,
      template_name: meme.template_title,
      image_url: meme.image_url,
      origin: 'imgflip',
      _id: meme._id,
    }));

    // Combine the memes
    const combinedMemes = [...imgFlipMemesFiltered];

    // Pagination logic
    const paginatedMemes = combinedMemes.slice(skip, skip + parseInt(limit));

    // Total memes count
    const totalMemes = imgFlipMemes.length;

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
    const imgFlipMemes = await MemeImgFlip.find(query).lean();

    const imgFlipMemesFiltered = imgFlipMemes.map((meme) => ({
      name: meme.title,
      template_name: meme.template_title,
      image_url: meme.image_url,
      origin: 'imgflip',
      _id: meme._id,
    }));

    const combinedMemes = [...imgFlipMemesFiltered];
    const paginatedMemes = combinedMemes.slice(skip, skip + parseInt(limit));

    const totalMemes = imgFlipMemes.length;

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

    res.status(404).json({ message: 'Meme not found' });
  } catch (error) {
    console.error('Error retrieving meme:', error);
    res.status(500).json({ error: 'Error retrieving meme', details: error.message });
  }
});

router.get('/alltemplates', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Fetch data from templates collections
    const kymMemes = await MemeKYM.find().lean();

    // Filter the templates for output format
    const kymMemesFiltered = kymMemes.map((template) => ({
      name: template.name,
      template_name: template.name,
      image_url: template.image_url,
      origin: 'kym',
      _id: template._id,
    }));

    // Combine the templates
    const combinedMemes = [...kymMemesFiltered];

    // Pagination logic
    const paginatedMemes = combinedMemes.slice(skip, skip + parseInt(limit));

    // Total templates count
    const totalMemes = kymMemes.length;

    res.json({
      templates: paginatedMemes,
      totalPages: Math.ceil(totalMemes / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('Error retrieving templates:', error);
    res.status(500).json({ error: 'Error retrieving templates', details: error.message });
  }
});

router.get('/templates', async (req, res) => {
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

    // Fetch data from templates collections based on the query
    const kymMemes = await MemeKYM.find(query).lean();

    const kymMemesFiltered = kymMemes.map((template) => ({
      name: template.name,
      template_name: template.name,
      image_url: template.image_url,
      origin: 'kym',
      _id: template._id,
    }));

    const combinedMemes = [...kymMemesFiltered];
    const paginatedMemes = combinedMemes.slice(skip, skip + parseInt(limit));

    const totalMemes = kymMemes.length;

    res.json({
      templates: paginatedMemes,
      totalPages: Math.ceil(totalMemes / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('Error retrieving templates:', error);
    res.status(500).json({ error: 'Error retrieving templates', details: error.message });
  }
});


router.get('/template/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const kymMeme = await MemeKYM.findById(id);
    if (kymMeme) {
      const { name, description, image_url, gen_description, gen_explanation, gen_fitted_frames } = kymMeme;
      return res.json({ name, template_name: name, description, image_url, origin: 'kym', _id: kymMeme._id, gen_description, gen_explanation, gen_fitted_frames });
    }

    res.status(404).json({ message: 'Template not found' });
  } catch (error) {
    console.error('Error retrieving template:', error);
    res.status(500).json({ error: 'Error retrieving template', details: error.message });
  }
});

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
