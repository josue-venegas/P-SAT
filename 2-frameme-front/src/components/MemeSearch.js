import React, { useState } from 'react';
import axios from 'axios';
import { extractedFrames } from '../extractedFrames';

const MemeSearch = () => {
  const [frame, setFrame] = useState('');
  const [memes, setMemes] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllFrames, setShowAllFrames] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Number of memes per page
  const maxPageButtons = 5; // Maximum number of page buttons to show at a time

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

  const handleSearchAll = async () => {
    setIsSearching(true);
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/all');
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
    setCurrentPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const displayedFrames = showAllFrames ? extractedFrames : extractedFrames.slice(0, 10);

  // Pagination logic
  const totalPages = Math.ceil(memes.length / itemsPerPage);
  const currentMemes = memes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className={`bg-white p-6 ${isSearching ? '' : 'flex items-center justify-center'}`}>
      <div className={`w-full max-w-xl ${isSearching ? 'mb-10' : ''}`}>
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
          <button
            onClick={handleSearchAll}
            className="p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Search All
          </button>
        </div>

        {!isSearching && (
          <div className="mt-6 space-x-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Available Frames</h3>
            {displayedFrames.map((availableFrame) => (
              <button
                key={availableFrame}
                onClick={() => setFrame((prevFrame) => (prevFrame ? `${prevFrame},${availableFrame}` : availableFrame))}
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentMemes.map((meme) => (
              <div key={meme._id} className="bg-gray-50 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-indigo-600">{meme.name}</h3>
                <img
                  src={meme.image_url}
                  alt={meme.name}
                  className="mt-4 rounded-md w-full"
                />
                <p className="text-gray-700 mt-2">{meme.gen_description}</p>
                <hr className="my-4" />
                <p className="text-gray-700 mt-2">{meme.gen_explanation}</p>
                <div className="mt-4">
                  {meme.gen_fitted_frames.map((fittedFrame) => (
                    <div key={fittedFrame.name} className="bg-gray-100 p-2 rounded-lg mt-2">
                      <p className="text-gray-700 font-semibold">{fittedFrame.name}</p>
                      <p className="text-gray-500 text-sm">{fittedFrame.reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none disabled:opacity-50"
            >
              Previous
            </button>
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 border rounded-lg ${page === currentPage ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'} hover:bg-indigo-500 hover:text-white`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MemeSearch;
