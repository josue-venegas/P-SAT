const express = require('express');
const router = express.Router();
// const MemeKYM = require('../models/memeKYM');
const localTemplates = require('../models/localTemplates');

router.get('/alltemplates', async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;
  
      // Fetch data from templates collections
      //const kymMemes = await MemeKYM.find().lean();
      const templatesLocal = await localTemplates.find().lean();
  
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
  
      // Combine the templates
      //const combinedMemes = [...kymMemesFiltered];
      const combinedMemes = [...templatesLocalFiltered];
  
      // Pagination logic
      const paginatedMemes = combinedMemes.slice(skip, skip + parseInt(limit));
  
      // Total templates count
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