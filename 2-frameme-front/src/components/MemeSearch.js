import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractedFrames } from '../extractedFrames';

const MemeSearch = () => {
  const [frames, setFrames] = useState('');
  const [showAllFrames, setShowAllFrames] = useState(false);

  const navigate = useNavigate();

  const handleSearch = () => {
    if (!frames) return;
    navigate(`/memes?frames=${encodeURIComponent(frames)}`);
  };

  const handleSearchAll = () => {
    navigate('/memes?all=true');
  };

  const displayedFrames = showAllFrames ? extractedFrames : extractedFrames.slice(0, 10);

  return (
    <div className={`bg-white p-6 flex items-center justify-center`}>
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-indigo-600 mb-6">FraMeme Search</h1>
        <div className="flex space-x-4 items-center">
          <input
            type="text"
            placeholder="Enter a frame (e.g., Surprised)"
            value={frames}
            onChange={(e) => setFrames(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSearch}
            className="p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Search
          </button>
          <button
            onClick={handleSearchAll}
            className="p-3 bg-white text-indigo-600 font-semibold rounded-lg border border-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Show All
          </button>
        </div>

        <div className="mt-6 space-x-4 space-y-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Available Frames</h3>
          {displayedFrames.map((availableFrame) => (
            <button
              key={availableFrame}
              onClick={() => setFrames((prevFrame) => (prevFrame ? `${prevFrame},${availableFrame}` : availableFrame))}
              className="p-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {availableFrame}
            </button>
          ))}
          <div className="mt-4">
            <button
              onClick={() => setShowAllFrames(!showAllFrames)}
              className="text-indigo-600 font-semibold hover:underline focus:outline-none"
            >
              {showAllFrames ? 'Show Less' : 'Show All'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeSearch;
