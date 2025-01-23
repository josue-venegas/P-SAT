import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MemeSearch from './components/MemeSearch';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
        <Routes>
          <Route path="/" element={<MemeSearch />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
