import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MemeSearch from './components/MemeSearch';
import MemeResults from './components/MemeResults';
import MemeDetails from './components/MemeDetails';
import TemplateSearch from './components/TemplateSearch';
import TemplateResults from './components/TemplateResults';
import TemplateDetails from './components/TemplateDetails';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
        <Routes>
          <Route path="/" element={<MemeSearch />} />
          <Route path="/memes" element={<MemeResults />} />
          <Route path="/meme/:id" element={<MemeDetails />} />

          <Route path="/templateSearch" element={<TemplateSearch />} />
          <Route path="/templates" element={<TemplateResults />} />
          <Route path="/template/:id" element={<TemplateDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
