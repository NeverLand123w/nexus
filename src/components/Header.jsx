// src/components/Header.jsx
import { GoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const handleLoginSuccess = async (credentialResponse) => {
    console.log(credentialResponse);
    const accessToken = credentialResponse.credential;
    
    // This is where you'll send the token to your backend
    try {
      const response = await axios.post('/api/auth/google', { token: accessToken });
      console.log('Backend response:', response.data);
      // Here you would typically save the user session (e.g., in context or local storage)
      alert(`Welcome, ${response.data.user.name}!`);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLoginError = () => {
    console.log('Login Failed');
  };

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/upload">Upload</Link>
      </div>
      <div>
        <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
      </div>
    </nav>
  );
};

export default Header;