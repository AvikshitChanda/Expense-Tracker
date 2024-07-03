import React, { useState, useEffect } from 'react';
import './Register.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import api from '../../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import LoaderAnimation from '../Loader/Loader'; // Adjust the path as needed
import logo from '../../assets/Logo.png'; // Adjust the path to your logo image

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true); // State to manage loading animation, initially true
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading delay with setTimeout for demo purposes
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword) {
      return toast.error('Please fill in all fields');
    }
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true); // Show loader animation

    try {
      const response = await api.post('/auth/register', { username, password });

      toast.success(response.data.message); // Display success message from the backend

      // Simulate redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
        setLoading(false); // Hide loader animation
      }, 2000);
    } catch (error) {
      console.error('Error registering:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      setLoading(false); // Hide loader animation on error
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" />
        </div>
      </nav>

      {/* Register Form */}
      <div className="register-form">
        <h2>Register</h2>
        {loading && <LoaderAnimation />} {/* Show loader animation while loading */}
        <form onSubmit={handleRegister}>
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;
