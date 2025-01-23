import React, { useState } from 'react';
import axios from 'axios';

const MemeUpload = () => {
  const [name, setName] = useState('');
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [frames, setFrames] = useState([{ name: '', justification: '' }]);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFrameChange = (index, field, value) => {
    const updatedFrames = [...frames];
    updatedFrames[index][field] = value;
    setFrames(updatedFrames);
  };

  const addFrame = () => {
    setFrames([...frames, { name: '', justification: '' }]);
  };

  const removeFrame = (index) => {
    const updatedFrames = frames.filter((_, i) => i !== index);
    setFrames(updatedFrames);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setStatus('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('caption', caption);
    formData.append('description', description);
    formData.append('frames', JSON.stringify(frames));

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setStatus('Meme uploaded successfully!');
        setName('');
        setCaption('');
        setDescription('');
        setFrames([{ name: '', justification: '' }]);
        setFile(null);
      }
    } catch (error) {
      console.error('Error uploading meme:', error);
      setStatus('Failed to upload meme. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-indigo-600 mb-6">Upload a Meme</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-lg font-medium text-gray-700">Meme Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="caption" className="block text-lg font-medium text-gray-700">Caption:</label>
            <input
              type="text"
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-lg font-medium text-gray-700">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Frames:</label>
            {frames.map((frame, index) => (
              <div key={index} className="space-y-2 mb-4">
                <input
                  type="text"
                  placeholder="Frame name"
                  value={frame.name}
                  onChange={(e) => handleFrameChange(index, 'name', e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <textarea
                  placeholder="Justification"
                  value={frame.justification}
                  onChange={(e) => handleFrameChange(index, 'justification', e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
                {frames.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFrame(index)}
                    className="text-red-600 font-semibold hover:underline"
                  >
                    Remove Frame
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addFrame}
              className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Add Frame
            </button>
          </div>

          <div>
            <label htmlFor="file" className="block text-lg font-medium text-gray-700">Meme Image:</label>
            <input
              type="file"
              id="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Upload Meme
          </button>
        </form>

        <div>
          <a
            href="/"
            className="block text-center text-indigo-600 font-semibold mt-6 hover:underline"
          >
            Go back
          </a>
        </div>

        {status && (
          <p className={`mt-4 text-center font-medium ${status.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default MemeUpload;
