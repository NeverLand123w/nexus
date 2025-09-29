// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; // Import the new Header
import UploadPage from './pages/UploadPage'; // Import the UploadPage

const Home = () => <h2>Home Page (Feed)</h2>;
const Upload = () => <h2>Upload Page</h2>;
const Watch = () => <h2>Watch Page</h2>;

function App() {
  return (
    <Router>
      <Header /> {/* Use the Header component */}
      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/watch/:videoId" element={<Watch />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;