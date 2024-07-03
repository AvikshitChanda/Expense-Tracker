import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login/Login';
import Expense from './components/Expense/Expense';
import Register from './components/Register/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Income from './components/Income/Income';
import LoaderAnimation from './components/Loader/Loader'; // Replace with your actual animation component import
import api from './utils/api'; // Import your API utility
import LandingPage from './components/Landing/LandingPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username')); // Add state for username
  const [userData, setUserData] = useState(null); // State to hold user data
  const [showLoader, setShowLoader] = useState(true); // State to control loader visibility

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Simulate a delay or perform actual initial data fetching
        await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate 3 seconds delay

        // After 3 seconds, hide the loader
        setShowLoader(false);

        if (token) {
          fetchUserData(); // Fetch user-specific data when token changes
        } else {
          setUserData(null); // Reset user data when logged out
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        // Handle error or retry logic if needed
      }
    };

    fetchInitialData();
  }, [token]);

  const setTokenInStorage = (newToken, newUsername) => {
    setToken(newToken);
    setUsername(newUsername);
    if (newToken) {
      localStorage.setItem('token', newToken);
      localStorage.setItem('username', newUsername); // Store username in local storage
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('username'); // Remove username from local storage
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await api.get('auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data); // Set user data after successful fetch
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const PrivateRoute = ({ element: Element }) => {
    return token ? <Element token={token} userData={userData} username={username} /> : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <div className='AppDiv'>
        {showLoader && <LoaderAnimation />} {/* Show loader while loading */}
        {!showLoader && (
          <Routes>
            <Route path='/' element={<LandingPage/>} />
            <Route path='/login' element={<Login setToken={(newToken, newUsername) => setTokenInStorage(newToken, newUsername)} />} />
            <Route path='/register' element={<Register />} />
            <Route path='/dashboard' element={<PrivateRoute element={Dashboard} />} />
            <Route path='/income' element={<PrivateRoute element={Income} />} />
            <Route path='/expenses' element={<PrivateRoute element={Expense} />} />
            <Route path='*' element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
