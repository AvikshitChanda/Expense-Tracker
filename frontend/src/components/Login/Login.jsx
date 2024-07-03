import React, { useState } from 'react';
import './Login.css';
import api from '../../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import LoaderAnimation from '../Loader/Loader'; 
import Logo from '../../assets/Logo.png';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true); 
    try {
      const response = await api.post('/auth/login', { username, password });

      if (!response || !response.data || !response.data.token) {
        throw new Error('Login failed. Please try again.');
      }

      const { token } = response.data;
    
      setToken(token, username);
      toast.success('Login successful!');

  
      setTimeout(() => {
        navigate('/dashboard');
        setLoading(false); 
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
      setLoading(false); 
    }
  };

  return (
    <div>
 
      <div className="navbar">
        <img src={Logo} alt="Logo" className="logo" />
      </div>

  
      <div className="login-form">
        <h2>Login</h2>
        {loading && <LoaderAnimation />} 
        {error && <p className="error-message">{error}</p>}
        {!loading && (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Login</button>
          </form>
        )}
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
