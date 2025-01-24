const express = require('express');
const router = express.Router();
const MemeKYM = require('../models/memeKYM');

router.get('/alltemplates', async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;
  
      // Fetch data from templates collections
      const kymMemes = await MemeKYM.find().lean();
  
      const kymMemesFiltered = kymMemes.map((template) => ({
        name: template.name,
        template_name: template.name,
        image_url: template.image_url,
        gen_fitted_frames: template.gen_fitted_frames,
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

module.exports = router;