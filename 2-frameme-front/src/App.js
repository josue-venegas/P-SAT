import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MemeSearch from './components/MemeSearch';
import MemeUpload from './components/MemeUpload';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
        <Routes>
          <Route path="/" element={<MemeSearch />} />
          <Route path="/upload" element={<MemeUpload />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
