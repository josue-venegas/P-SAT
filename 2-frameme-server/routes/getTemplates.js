const express = require('express');
const router = express.Router();
// const MemeKYM = require('../models/memeKYM');
const localTemplates = require('../models/localTemplates');

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
      //const kymMemes = await MemeKYM.find(query).lean();
      const templatesLocal = await localTemplates.find(query).lean();
  
      /* const kymMemesFiltered = kymMemes.map((template) => ({
        name: template.name,
        template_name: template.name,
        image_url: template.image_url,
        gen_fitted_frames: template.gen_fitted_frames,
        origin: 'kym',
        _id: template._id,
      })); */

      const templatesLocalFiltered = templatesLocal.map((template) => ({
        name: template.name,
        template_name: template.name,
        image_url: template.image_url,
        gen_description: template.gen_description,
        gen_explanation: template.gen_explanation,
        gen_fitted_frames: template.gen_fitted_frames,
        origin: 'local',
        _id: template._id,
      }));
  
      //const combinedMemes = [...kymMemesFiltered];
      const combinedMemes = [...templatesLocalFiltered];

      const paginatedMemes = combinedMemes.slice(skip, skip + parseInt(limit));
  
      //const totalMemes = kymMemes.length;
      const totalMemes = templatesLocal.length;
  
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

module.exports = router;