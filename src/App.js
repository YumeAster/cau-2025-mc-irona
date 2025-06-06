import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AlarmSettingPage from './pages/AlarmSettingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/alarm" element={<AlarmSettingPage />} />
        <Route path="/alarm/new" element={<AlarmSettingPage isNew />} />
        <Route path="/alarm/:id" element={<AlarmSettingPage />} />
      </Routes>
    </Router>
  );
}

export default App;