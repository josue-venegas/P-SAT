import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractedFrames } from '../extractedFrames';

const MemeSearch = () => {
  const [frames, setFrames] = useState('');
  const [mode, setMode] = useState('any');
  const [showAllFrames, setShowAllFrames] = useState(false);

  const navigate = useNavigate();

  const handleSearch = () => {
    if (!frames) return;
    navigate(`/memes?frames=${encodeURIComponent(frames)}&mode=${mode}`);
  };

  const handleReset = () => {
    setFrames('');
    setMode('any');
  };

  const handleSearchAll = () => {
    navigate('/memes?all=true');
  };

  const displayedFrames = showAllFrames ? extractedFrames : extractedFrames.slice(0, 10);

  return (
    <div className="w-2/4 bg-white p-6 flex items-center justify-center">
      <div>
        <img src="/logo_250.png" alt="FraMeme Search Logo" className="w-24 h-24 mx-auto" />
        <h1 className="text-4xl font-semibold text-center text-indigo-600 mb-12">FraMeme Search</h1>
        <div className="space-y-4">
          {/* Dropdown Label with Tooltip */}
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <div className="flex space-x-2">
                <label
                  htmlFor="mode-select"
                  className="text-sm font-semibold text-gray-700 mb-1"
                >
                  Search Mode:
                </label>

                {/* Tooltip Icon */}
                <div className="relative group">
                  <div className="w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold cursor-pointer hover:bg-indigo-700">
                    ?
                  </div>
                  <div className="absolute left-8 top-0 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
                    <p className="mb-1 font-semibold">&bull; Inclusive: <span className="font-normal">"Contains any frame"</span></p>
                    <p className="indent-2 mb-4">
                      Search any meme that has at least one of the typed frames. It's the most flexible and open.
                    </p>
                    <p className="mb-1 font-semibold">&bull; Exclusive: <span className="font-normal">"Contains all frames"</span></p>
                    <p className="indent-2 mb-4">
                      Search any meme that has at least all the typed frames.
                    </p>
                    <p className="mb-1 font-semibold">&bull; Exact: <span className="font-normal">"Contains exactly the frames"</span></p>
                    <p className="indent-2">
                      Search any meme that match the frames exactly, no more, no less.
                    </p>
                  </div>
                </div>
              </div>
              
              <select
                id="mode-select"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="any">Inclusive (any)</option>
                <option value="all">Exclusive (all)</option>
                <option value="exact">Exact</option>
              </select>
            </div>
          </div>
          
          {/* Search Bar Label */}
          <div className="flex flex-col">
            <label
              htmlFor="frames-input"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Enter Frames:
            </label>
            <input
              id="frames-input"
              type="text"
              placeholder="Enter frames separated by commas (e.g. Hunger, Idea)"
              value={frames}
              onChange={(e) => setFrames(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Search Button */}
          <div className="flex space-x-4">
            <button
              onClick={handleSearch}
              className="p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Search
            </button>
            <button
              onClick={handleReset}
              className="p-3 bg-white text-indigo-600 border border-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Reset
            </button>
            <button
              onClick={handleSearchAll}
              className="text-indigo-600 font-semibold hover:underline focus:outline-none"
            >
              Show all Memes
            </button>
          </div>
        </div>

        {/* Available Frames */}
        <div className="mt-12 space-x-4 space-y-2">
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
              {showAllFrames ? 'Show less frames' : 'Show all Frames'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeSearch;
