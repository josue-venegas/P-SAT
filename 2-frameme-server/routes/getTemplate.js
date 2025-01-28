const express = require('express');
const router = express.Router();
// const MemeKYM = require('../models/memeKYM');
const localTemplates = require('../models/localTemplates');

router.get('/template/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      /* const kymMeme = await MemeKYM.findById(id);
      if (kymMeme) {
        const { name, description, image_url, gen_description, gen_explanation, gen_fitted_frames } = kymMeme;
        return res.json({ name, template_name: name, description, image_url, origin: 'kym', _id: kymMeme._id, gen_description, gen_explanation, gen_fitted_frames });
      } */

      const localTemplate = await localTemplates.findById(id);
      if (localTemplate) {
        const { name, description, image_url, gen_description, gen_explanation, gen_fitted_frames } = localTemplate;
        return res.json({ name, template_name: name, description, image_url, origin: 'local', _id: localTemplate._id, gen_description, gen_explanation, gen_fitted_frames });
      }
  
      res.status(404).json({ message: 'Template not found' });
    } catch (error) {
      console.error('Error retrieving template:', error);
      res.status(500).json({ error: 'Error retrieving template', details: error.message });
    }
});

module.exports = router;