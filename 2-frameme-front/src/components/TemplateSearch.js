import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractedFrames } from '../extractedFrames';

const TemplateSearch = () => {
  const [frames, setFrames] = useState('');
  const [mode, setMode] = useState('any');
  const [showAllFrames, setShowAllFrames] = useState(false);

  const navigate = useNavigate();

  const handleSearch = () => {
    if (!frames) return;
    navigate(`/templates?frames=${encodeURIComponent(frames)}&mode=${mode}`);
  };

  const handleReset = () => {
    setFrames('');
    setMode('any');
  };

  const handleSearchAll = () => {
    navigate('/templates?all=true');
  };

  const goToMemeSearch = () => {
    navigate('/');
  };

  const downloadJSON = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/downloadTemplatesJSON");
      if (!response.ok) {
        throw new Error("Failed to fetch JSON");
      }

      const blob = await response.blob(); // Convert the response to a Blob
      const url = window.URL.createObjectURL(blob); // Create a URL for the Blob

      // Create a temporary anchor element for the download
      const link = document.createElement("a");
      link.href = url;
      link.download = "templates.json"; // Name of the downloaded file
      link.click(); // Programmatically trigger the download

      // Clean up
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading JSON:", error);
    }
  };

  const displayedFrames = showAllFrames ? extractedFrames : extractedFrames.slice(0, 10);

  return (
    <div className="w-2/4 bg-white p-10">
      <div className="flex justify-between">
        <div className="flex space-x-4">
          <button
            onClick={goToMemeSearch}
            className="text-pink-600 font-semibold hover:underline focus:outline-none"
          >
            Search Memes
          </button>
          <button
            className="disabled font-semibold"
          >
            Search Templates
          </button>
        </div>
        <div>
          <button
            onClick={downloadJSON}
            className="text-pink-600 font-semibold hover:underline focus:outline-none"
          >
            Download collection as JSON
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        <img src="/logo_250_pink.png" alt="FraMeme Search Logo Pink" className="w-24 h-24 mx-auto" />
        <h1 className="text-4xl font-semibold text-center text-pink-600 mb-2">FraMeme Search</h1>
        <h2 className="text-lg font-semibold text-center text-gray-700 mb-12">Search templates by their frames</h2>
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
                  <div className="w-4 h-4 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold cursor-pointer hover:bg-pink-700">
                    ?
                  </div>
                  <div className="absolute left-8 top-0 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
                    <p className="mb-1 font-semibold">&bull; Inclusive: <span className="font-normal">"Contains any frame"</span></p>
                    <p className="indent-2 mb-4">
                      Search any template that has at least one of the typed frames. It's the most flexible and open.
                    </p>
                    <p className="mb-1 font-semibold">&bull; Exclusive: <span className="font-normal">"Contains all frames"</span></p>
                    <p className="indent-2 mb-4">
                      Search any template that has at least all the typed frames.
                    </p>
                    <p className="mb-1 font-semibold">&bull; Exact: <span className="font-normal">"Contains exactly the frames"</span></p>
                    <p className="indent-2">
                      Search any template that match the frames exactly, no more, no less.
                    </p>
                  </div>
                </div>
              </div>
              
              <select
                id="mode-select"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
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
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Search Button */}
          <div className="flex space-x-4">
            <button
              onClick={handleSearch}
              className="p-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              Search
            </button>
            <button
              onClick={handleReset}
              className="p-3 bg-white text-pink-600 border border-pink-600 font-semibold rounded-lg hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              Reset
            </button>
            <button
              onClick={handleSearchAll}
              className="text-pink-600 font-semibold hover:underline focus:outline-none"
            >
              Show all Templates
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
              className="p-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {availableFrame}
            </button>
          ))}
          <div className="mt-4">
            <button
              onClick={() => setShowAllFrames(!showAllFrames)}
              className="text-pink-600 font-semibold hover:underline focus:outline-none"
            >
              {showAllFrames ? 'Show less frames' : 'Show all Frames'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSearch;
