import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css';
import ScreenWrapper from './components/ScreenWrapper';
import { Home } from './modules/Home';
import Profile from './modules/Profile';
import Marketplace from './modules/Marketplace';

function App() {
  return (
    <BrowserRouter>
      <ScreenWrapper>
        <Routes>
          <Route path="/" element={<Home />} key="home" />
          <Route path="/profile" element={<Profile />} key="profile" />
          <Route path="/marketplace" element={<Marketplace />} key="marketplace" />
        </Routes>
      </ScreenWrapper>
    </BrowserRouter>
  );
}

export default App;
