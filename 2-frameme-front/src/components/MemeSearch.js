import React, { useState } from 'react';
import axios from 'axios';
import { extractedFrames } from '../extractedFrames';
import { useNavigate } from 'react-router-dom';

const MemeSearch = () => {
  const [frame, setFrame] = useState('');
  const [memes, setMemes] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllFrames, setShowAllFrames] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const maxPageButtons = 5;

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

  const navigate = useNavigate();

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
            className="p-3 bg-white text-indigo-600 font-semibold rounded-lg border border-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Show All
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
                <h3 className="text-xl font-semibold text-indigo-600"><a href={`/meme/${meme._id}`}>{meme.name || "No name"}</a></h3>
                <img
                  src={meme.image_url}
                  alt={meme.name}
                  className="mt-4 rounded-md w-full cursor-pointer"
                  onClick={() => navigate(`/meme/${meme._id}`)}
                />

                <p className="font-semibold mt-2">Origin</p>
                <p className="text-gray-700">{meme.origin}</p>

                <hr className="my-4" />

                <p className="font-semibold mt-2">Template name</p>
                <p className="text-gray-700">{meme.template_name || "No template name"}</p>

                <hr className="my-4" />

                <button
                  onClick={() => navigate(`/meme/${meme._id}`)}
                  className="block w-full p-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  View more details
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button 
              onClick={() => handlePageChange(1)} 
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none disabled:opacity-50"
            >
              &#xab; First
            </button>

            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none disabled:opacity-50"
            >
              &#x2039; Previous
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
              Next &#x203A;
            </button>
            <button 
              onClick={() => handlePageChange(totalPages)} 
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none disabled:opacity-50"
            >
              Last &#xbb;
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MemeSearch;
