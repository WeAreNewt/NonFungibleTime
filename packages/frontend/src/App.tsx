import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ScreenWrapper from './components/ScreenWrapper';
import { Home } from './modules/Home';
import Profile from './modules/Profile';
import Marketplace from './modules/Marketplace';
import * as Web3 from './modules/Web3';

function App() {
  return (
    <Web3.Provider>
      <BrowserRouter>
        <ScreenWrapper>
          <Routes>
            <Route path="/" element={<Home />} key="home" />
            <Route path="/profile" element={<Profile />} key="profile" />
            <Route path="/marketplace" element={<Marketplace />} key="marketplace" />
          </Routes>
        </ScreenWrapper>
      </BrowserRouter>
    </Web3.Provider>
  );
}

export default App;
