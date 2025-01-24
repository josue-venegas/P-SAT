import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MemeSearch from './components/MemeSearch';
import MemeDetails from './components/MemeDetails';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
        <Routes>
          <Route path="/" element={<MemeSearch />} />
          <Route path="/meme/:id" element={<MemeDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
