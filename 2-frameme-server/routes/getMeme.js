const express = require('express');
const router = express.Router();
/* const MemeImgFlip = require('../models/memeImgFlip');
const MemeRedditEs = require('../models/memeRedditEs');
const MemeRedditFr = require('../models/memeRedditFr'); */
const LocalMemesEn = require('../models/localMemesEn');
const LocalMemesEs = require('../models/localMemesEs');
const LocalMemesFr = require('../models/localMemesFr');

router.get('/meme/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      /* const imgFlipMeme = await MemeImgFlip.findById(id);
      if (imgFlipMeme) {
        const { title, template_title, image_url, gen_description, gen_explanation, gen_fitted_frames } = imgFlipMeme;
        return res.json({ name: title, template_name: template_title, image_url, origin: 'imgflip', _id: imgFlipMeme._id, gen_description, gen_explanation, gen_fitted_frames });
      }

      const redditSpanishMeme = await MemeRedditEs.findById(id);
      if (redditSpanishMeme) {
        const { url, gen_description, gen_explanation, gen_fitted_frames } = redditSpanishMeme;
        return res.json({ image_url: url, origin: 'reddit-spanish', _id: redditSpanishMeme._id, gen_description, gen_explanation, gen_fitted_frames });
      }

      const redditFrenchMeme = await MemeRedditFr.findById(id);
      if (redditFrenchMeme) {
        const { url, gen_description, gen_explanation, gen_fitted_frames } = redditFrenchMeme;
        return res.json({ image_url: url, origin: 'reddit-french', _id: redditFrenchMeme._id, gen_description, gen_explanation, gen_fitted_frames });
      } */

      const localMemesEn = await LocalMemesEn.findById(id);
      if (localMemesEn) {
        const { name, template_name, url, gen_description, gen_explanation, gen_fitted_frames } = localMemesEn;
        return res.json({ name, template_name, image_url: url, origin: 'local-en', _id: localMemesEn._id, gen_description, gen_explanation, gen_fitted_frames });
      }

      const localMemesEs = await LocalMemesEs.findById(id);
      if (localMemesEs) {
        const { name, template_name, url, gen_description, gen_explanation, gen_fitted_frames } = localMemesEs;
        return res.json({ name, template_name, image_url: url, origin: 'local-es', _id: localMemesEs._id, gen_description, gen_explanation, gen_fitted_frames });
      }

      const localMemesFr = await LocalMemesFr.findById(id);
      if (localMemesFr) {
        const { name, template_name, url, gen_description, gen_explanation, gen_fitted_frames } = localMemesFr;
        return res.json({ name, template_name, image_url: url, origin: 'local-fr', _id: localMemesFr._id, gen_description, gen_explanation, gen_fitted_frames });
      }
  
      res.status(404).json({ message: 'Meme not found' });
    } catch (error) {
      console.error('Error retrieving meme:', error);
      res.status(500).json({ error: 'Error retrieving meme', details: error.message });
    }
});

module.exports = router;