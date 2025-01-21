import React, { useState } from 'react';
import axios from 'axios';

const MemeSearch = () => {
  const [frame, setFrame] = useState('');
  const [memes, setMemes] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const availableFrames = ['Happy', 'Sad', 'Angry', 'Surprised', 'Disgusted', 'Fearful'];

  const handleSearch = async () => {
    if (!frame) {
      return;
    }
    setIsSearching(true);
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/memes', {
        params: { frames: frame.split(',') },
      });
      setMemes(response.data);
    } catch (error) {
      console.error('Error fetching memes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFrame('');
    setMemes([]);
    setIsSearching(false);
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`bg-white p-6 ${isSearching ? '' : 'flex items-center justify-center'} w-2/4`}>
      <div className={`w-full max-w-xl ${isSearching ? 'fixed top-0 left-0 right-0 p-4 bg-white shadow-md z-10' : ''}`}>
        <h1 className={`text-3xl font-semibold text-center text-indigo-600 ${isSearching ? 'hidden' : 'mb-6'}`}>
          FraMeme Search
        </h1>

        {isSearching && (
          <button
            onClick={handleReset}
            className="block text-center text-indigo-600 font-semibold mb-6 hover:underline"
          >
            Go back
          </button>
        )}

        <div className="flex space-x-4 items-center">
          <input
            type="text"
            placeholder="Enter a frame (e.g., Surprised)"
            value={frame}
            onChange={(e) => setFrame(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSearch}
            className="p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Search
          </button>
        </div>

        <div className="mt-6 space-x-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Available Frames</h3>
          {availableFrames.map((availableFrame) => (
            <button
              key={availableFrame}
              onClick={() => setFrame((prevFrame) => (prevFrame ? `${prevFrame},${availableFrame}` : availableFrame))}
              className="p-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {availableFrame}
            </button>
          ))}
        </div>

        {!isSearching && (
          <div>
            <a
              href="/upload"
              className="block text-center text-indigo-600 font-semibold mt-6 hover:underline"
            >
              Upload a Meme
            </a>
          </div>
        )}
      </div>

      {isSearching && isLoading && (
        <div className="m-2 text-center">
          <p className="text-gray-600">Searching...</p>
        </div>
      )}

      {isSearching && !isLoading && memes.length === 0 && (
        <div className="m-2 text-center">
          <p className="text-gray-600">No memes found 😔</p>
        </div>
      )}

      {isSearching && !isLoading && memes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {memes.map((meme) => (
            <div key={meme._id} className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-indigo-600">{meme.name}</h3>
              <img
                src={meme.file}
                alt={meme.name}
                className="mt-4 rounded-md w-full"
              />
              <p className="text-gray-700 mt-2">{meme.caption}</p>
              <p className="text-gray-500 mt-1 text-sm">{meme.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemeSearch;
