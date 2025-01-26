const mongoose = require('mongoose');

const memeRedditFr = new mongoose.Schema({
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

module.exports = mongoose.model('reddit-french-memes', memeRedditFr, 'reddit-french-memes');
