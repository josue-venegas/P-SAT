const mongoose = require('mongoose');

const memeImgFlipSchema = new mongoose.Schema({
  template_title: String,
  template_ID: String,
  url: String,
  title: String,
  author: String,
  image_url: String,
  alt_text: String,
  view_count: Number,
  upvote_count: Number,
  comment_count: Number || null,
  gen_description: String,
  gen_explanation: String,
  gen_fitted_frames: [
    {
      name: String,
      reasoning: String,
    },
  ]
});

module.exports = mongoose.model('imgflip', memeImgFlipSchema, 'imgflip');
