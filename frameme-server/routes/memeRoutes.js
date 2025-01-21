const express = require('express');
const multer = require('multer');
const Meme = require('../models/meme');
const { uploadFileToGridFS, getFileFromGridFS } = require('../utils/gridfs');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  const { name, caption, description, frames } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const fileId = await uploadFileToGridFS(req.file);

    const parsedFrames = JSON.parse(frames);
    if (!Array.isArray(parsedFrames)) {
      return res.status(400).json({ error: 'Frames must be an array of objects' });
    }
    const formattedFrames = parsedFrames.map((frame) => {
      if (!frame.name || !frame.justification) {
        throw new Error('Each frame must have a name and justification');
      }
      return {
        name: frame.name,
        justification: frame.justification,
      };
    });

    const newMeme = new Meme({
      name,
      caption,
      description,
      frames: formattedFrames,
      fileId,
    });

    await newMeme.save();
    res.status(201).json({ message: 'Meme uploaded successfully' });
  } catch (error) {
    console.error('Error uploading meme:', error);
    res.status(500).json({ error: 'Error uploading meme', details: error.message });
  }
});


router.get('/memes', async (req, res) => {
  const { frames } = req.query;

  if (!frames) {
    return res.status(400).json({ error: 'No frames specified for search' });
  }

  try {
    const frameArray = Array.isArray(frames) ? frames : frames.split(',');
    const trimmedFrames = frameArray.map((frame) => frame.trim());

    const memes = await Meme.find({
      frames: {
        $all: trimmedFrames.map((frame) => ({ $elemMatch: { name: frame } })),
      },
    });

    if (memes.length === 0) {
      return res.status(404).json({ message: 'No memes found' });
    }

    const memesWithFile = await Promise.all(memes.map(async (meme) => {
      const file = await getFileFromGridFS(meme.fileId);
      return {
        ...meme.toObject(),
        file,
      };
    }));

    res.json(memesWithFile);
  } catch (error) {
    console.error('Error retrieving memes:', error);
    res.status(500).json({ error: 'Error retrieving memes', details: error.message });
  }
});



module.exports = router;
