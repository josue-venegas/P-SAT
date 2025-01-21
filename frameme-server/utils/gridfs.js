const { MongoClient, GridFSBucket } = require('mongodb');
const mongoURI = 'mongodb+srv://api_user:Eni4pojp5L6d8uoy@cluster0.n3lbu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function uploadFileToGridFS(file) {
    const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db();
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
  
    const uploadStream = bucket.openUploadStream(file.originalname, {
      contentType: file.mimetype,
    });
    uploadStream.end(file.buffer);
  
    return new Promise((resolve, reject) => {
      uploadStream.on('finish', () => {
        resolve(uploadStream.id);
      });
      uploadStream.on('error', (err) => reject(err));
    });
  }
  
async function getFileFromGridFS(fileId) {
  const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = client.db();
  const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

  const downloadStream = bucket.openDownloadStream(fileId);
  const chunks = [];

  return new Promise((resolve, reject) => {
    downloadStream.on('data', chunk => chunks.push(chunk));
    downloadStream.on('end', () => {
      const imageBuffer = Buffer.concat(chunks);
      const imageBase64 = imageBuffer.toString('base64');
      resolve(`data:image/jpeg;base64,${imageBase64}`);
    });
    downloadStream.on('error', (err) => reject(err));
  });
}

module.exports = { uploadFileToGridFS, getFileFromGridFS };
