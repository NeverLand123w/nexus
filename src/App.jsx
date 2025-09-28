// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Placeholder Components for now
const Home = () => <h2>Home Page (Feed)</h2>;
const Upload = () => <h2>Upload Page</h2>;
const Watch = () => <h2>Watch Page</h2>;

function App() {
  return (
    <Router>
      <div>
        {/* Temporary Navigation Header */}
        <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
          <Link to="/upload">Upload</Link>
        </nav>

        {/* Route Definitions */}
        <div style={{ padding: '1rem' }}>
           <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/watch/:videoId" element={<Watch />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;