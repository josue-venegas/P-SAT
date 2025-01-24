import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MemeDetails = () => {
  const { id } = useParams();
  const [meme, setMeme] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMemeDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/meme/${id}`);
        setMeme(response.data);
      } catch (error) {
        console.error('Error fetching meme details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemeDetails();
  }, [id]);

  if (isLoading) return <p>Loading...</p>;
  if (!meme) return <p>No details found for this meme.</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold text-indigo-600">{meme.name || 'No name'}</h1>
      <img src={meme.image_url} alt={meme.name} className="mt-4 rounded-md w-full" />
      <p className="mt-4"><strong>Origin:</strong> {meme.origin}</p>
        <p className="mt-4"><strong>Template name:</strong> {meme.template_name || 'No template name'}</p>
      <p className="mt-4"><strong>Description:</strong> {meme.gen_description || 'No description'}</p>
      <p className="mt-4"><strong>Explanation:</strong> {meme.gen_explanation || 'No explanation'}</p>
      <h2 className="mt-4 text-2xl font-semibold">Fitted Frames:</h2>
      {meme.gen_fitted_frames.length === 0 ? (
        <p>No fitted frames</p>
      ) : (
        meme.gen_fitted_frames.map((frame, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg mt-2">
            <p className="text-gray-700 font-semibold">{frame.name}</p>
            <p className="text-gray-500 text-sm">{frame.reasoning}</p>
          </div>
        ))
      )}
      <button
        onClick={() => window.history.back()}
        className="mt-6 p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
        Go Back
        </button>
    </div>
  );
};

export default MemeDetails;
