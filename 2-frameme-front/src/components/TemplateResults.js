import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TemplateResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(parseInt(queryParams.get('page') || 1));
  const [memesPerPage, setTemplatesPerPage] = useState(parseInt(queryParams.get('limit') || 8));
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchMemes = async () => {
      setIsLoading(true);

      try {
        const params = new URLSearchParams(location.search);
        const all = params.get('all');
        const frames = params.get('frames');
        const mode = params.get('mode');

        let endpoint = '';
        if (all) {
          endpoint = `http://localhost:5000/api/alltemplates?page=${currentPage}&limit=${memesPerPage}`;
        } else if (frames) {
          endpoint = `http://localhost:5000/api/templates?frames=${frames}&mode=${mode}&page=${currentPage}&limit=${memesPerPage}`;
        }

        const response = await axios.get(endpoint);
        setTemplates(response.data.templates);
        setTotalPages(response.data.totalPages); // Backend should return total pages
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemes();
  }, [location.search, currentPage, memesPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const newQueryParams = new URLSearchParams(location.search);
      newQueryParams.set('page', newPage);
      newQueryParams.set('limit', memesPerPage);
      navigate(`?${newQueryParams.toString()}`);
    }
  };

  const handleMemesPerPageChange = (newLimit) => {
    setTemplatesPerPage(newLimit);
    const newQueryParams = new URLSearchParams(location.search);
    newQueryParams.set('limit', newLimit);
    navigate(`?${newQueryParams.toString()}`);
  };

  const getPageNumbers = () => {
    const maxPageButtons = 5;
    const pages = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <button 
        onClick={() => navigate('/templateSearch')} 
        className="p-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
      >
        Go Back
      </button>
      <h1 className="text-3xl font-semibold text-pink-600 mb-6">Template Results</h1>

      {templates.length === 0 && <p>No templates found 😔</p>}
      
      {templates.length > 0 && (
        <div>
            <div className="flex justify-between items-center mb-4">
                <label>
                Memes per page:
                <select
                    value={memesPerPage}
                    onChange={(e) => handleMemesPerPageChange(parseInt(e.target.value))}
                    className="ml-2 p-1 border rounded"
                >
                    <option value={4}>4</option>
                    <option value={8}>8</option>
                    <option value={12}>12</option>
                </select>
                </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {templates.map((template) => (
                <div key={template._id} className="bg-gray-50 p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-pink-600">
                      <a href={`/template/${template._id}`}>{template.name || 'No name'}</a>
                    </h3>
                    <img
                      src={template.image_url}
                      alt={template.name}
                      className="mt-4 rounded-md w-full cursor-pointer"
                      onClick={() => navigate(`/template/${template._id}`)}
                    />
                    <p className="mt-2"><strong>Origin:</strong> {template.origin}</p>
                    <p className="mt-2 font-bold">Fitted Frames:</p>
                    {!template.gen_fitted_frames || template.gen_fitted_frames.length === 0 ? (<p>No fitted frames</p>) : (
                      <div>
                      <div className="flex flex-wrap gap-2">
                        {template.gen_fitted_frames.slice(0, 3).map((frame, index) => (
                          <div 
                            key={index}
                            className="p-2 bg-gray-100 text-gray-700 font-semibold rounded-lg"
                          >
                            {frame.name}
                          </div>
                        ))}
                        {template.gen_fitted_frames.length > 3 && (
                          <div className="p-2 text-gray-500 italic">
                            and {template.gen_fitted_frames.length - 3} more...
                          </div>
                        )}
                      </div>
                    </div>                    
                    )}
                    <button
                      onClick={() => navigate(`/template/${template._id}`)}
                      className="mt-4 p-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      View Template
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
                        className={`px-4 py-2 border rounded-lg ${page === currentPage ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-700'} hover:bg-pink-500 hover:text-white`}
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
            <div className="flex justify-center items-center mt-6">
                <span className="mx-4">Page {currentPage} of {totalPages}</span>
            </div>
        </div>
      )}
    </div>
  );
};

export default TemplateResults;
