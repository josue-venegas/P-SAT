const mongoose = require('mongoose');

const localTemplates = new mongoose.Schema({
  name: String,
  description: String,
  image_url: String,
  gen_description: String,
  gen_explanation: String,
  gen_fitted_frames: [
    {
      name: String,
      reasoning: String,
    },
  ]
});

module.exports = mongoose.model('localTemplates', localTemplates, 'local-templates');
