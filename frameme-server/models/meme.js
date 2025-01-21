const mongoose = require('mongoose');

const memeSchema = new mongoose.Schema({
  name: String,
  caption: String,
  description: String,
  frames: [
    {
      name: String,
      justification: String,
    },
  ],
  fileId: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model('Meme', memeSchema);
