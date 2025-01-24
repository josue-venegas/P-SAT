const express = require('express');
const router = express.Router();
const MemeImgFlip = require('../models/memeImgFlip');

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

module.exports = router;