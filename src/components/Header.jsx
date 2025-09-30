import React, { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // Import our context

const Header = () => {
  const { user, setUser, logout, isLoggedIn, loading } = useContext(UserContext);

  const handleLoginSuccess = async (credentialResponse) => {
    const accessToken = credentialResponse.credential;
    try {
        await setUser(accessToken);
    } catch (error) {
        console.error("Failed during login process:", error);
    }
  };

  const handleLoginError = () => {
    console.log('Login Failed');
  };
  
  // Render nothing or a loading spinner while checking session
  if (loading) {
    return (
       <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', height: '60px' }}>
          <p>Loading...</p>
       </nav>
    );
  }

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        {isLoggedIn && <Link to="/upload">Upload</Link>} {/* Only show upload if logged in */}
      </div>
      <div>
        {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <p style={{margin: 0}}>Welcome, {user.name}!</p>
                <img src={user.avatar_url} alt={user.name} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                <button onClick={logout}>Logout</button>
            </div>
        ) : (
            <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
        )}
      </div>
    </nav>
  );
};
export default Header;