const mongoose = require('mongoose');

const localMemesEs = new mongoose.Schema({
  name: String,
  template_name: String,
  url: String,
  gen_description: String,
  gen_explanation: String,
  gen_fitted_frames: [
    {
      name: String,
      reasoning: String,
    },
  ]
});

module.exports = mongoose.model('localMemesEs', localMemesEs, 'local-memes-es');
