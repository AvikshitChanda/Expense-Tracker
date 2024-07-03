import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login/Login';
import Expense from './components/Expense/Expense';
import Register from './components/Register/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Income from './components/Income/Income';
import LoaderAnimation from './components/Loader/Loader'; 
import api from './utils/api'; 
import LandingPage from './components/Landing/LandingPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username')); 
  const [userData, setUserData] = useState(null); 
  const [showLoader, setShowLoader] = useState(true); 

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
      
        await new Promise(resolve => setTimeout(resolve, 3000)); 

     
        setShowLoader(false);

        if (token) {
          fetchUserData(); 
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      
      }
    };

    fetchInitialData();
  }, [token]);

  const setTokenInStorage = (newToken, newUsername) => {
    setToken(newToken);
    setUsername(newUsername);
    if (newToken) {
      localStorage.setItem('token', newToken);
      localStorage.setItem('username', newUsername); 
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await api.get('auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data);
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
        {showLoader && <LoaderAnimation />} 
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
