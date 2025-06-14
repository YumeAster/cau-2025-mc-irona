import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash';
import HomePage from './pages/HomePage';
import AlarmSettingPage from './pages/AlarmSettingPage';
import AppSettingPage from './pages/AppSettingPage'; 
import LicensePage from './pages/LicensePage';
import BlacklistPage from './pages/BlacklistPage';

import MiniGameTestPage from './pages/MiniGameTestPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/alarm" element={<AlarmSettingPage />} />
        <Route path="/alarm/new" element={<AlarmSettingPage isNew />} />
        <Route path="/alarm/:id" element={<AlarmSettingPage />} />
        <Route path="/settings" element={<AppSettingPage />} />
        <Route path="/license" element={<LicensePage />} />
        <Route path="/blacklist" element={<BlacklistPage />} /> 

        <Route path="/game-test" element={<MiniGameTestPage />} />


      </Routes>
    </Router>
  );
}

export default App;