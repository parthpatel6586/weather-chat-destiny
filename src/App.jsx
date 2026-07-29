import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatWidget from './components/ChatWidget';
import { ChatProvider } from './context/ChatContext';
import Home from './pages/Home';
import Forecast from './pages/Forecast';
import SearchHistory from './pages/SearchHistory';
import MapView from './pages/MapView';
import { PiAlignCenterHorizontalDuotone } from 'react-icons/pi';

// import "./assets/styles/styles.css";
function App() {
  return (
    <ChatProvider>
      <Navbar />
      <main className="container" style={{ flex: 1, paddingTop: 20, paddingBottom: 40 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/history" element={<SearchHistory />} />
          <Route path="/map" element={<MapView />} />
           
                </Routes>
      </main>
      <ChatWidget />
    </ChatProvider>
  );
}

export default App;
