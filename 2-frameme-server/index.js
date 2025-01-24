const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const allMemes = require('./routes/allMemes');
const allTemplates = require('./routes/allTemplates');
const downloadMemes = require('./routes/downloadMemes');
const downloadTemplates = require('./routes/downloadTemplates');
const getMeme = require('./routes/getMeme');
const getTemplate = require('./routes/getTemplate');
const getMemes = require('./routes/getMemes');
const getTemplates = require('./routes/getTemplates');

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const mongoURI = 'mongodb+srv://api_user:Eni4pojp5L6d8uoy@cluster0.1zf1w.mongodb.net/memes?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

app.use('/api', allMemes);
app.use('/api', allTemplates);
app.use('/api', downloadMemes);
app.use('/api', downloadTemplates);
app.use('/api', getMeme);
app.use('/api', getTemplate);
app.use('/api', getMemes);
app.use('/api', getTemplates);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
