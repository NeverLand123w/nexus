// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';     // Import HomePage
import UploadPage from './pages/UploadPage';
import WatchPage from './pages/WatchPage';    // Import WatchPage

function App() {
  return (
    <Router>
      <Header />
      <div style={{ padding: '1rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />        {/* Use HomePage */}
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/watch/:videoId" element={<WatchPage />} /> {/* Use WatchPage */}
        </Routes>
      </div>
    </Router>
  );
}
export default App;