import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Landing.css';
import bgVideo from '../../assets/background.mp4';
import Logo from '../../assets/LogoWhite.png';
import Loader from '../Loader/Loader';

const LandingPage = () => {
  const [loading, setLoading] = useState(false);
  const [navigateTo, setNavigateTo] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        navigate(navigateTo);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, navigate, navigateTo]);

  const handleClick = (path) => {
    setNavigateTo(path);
    setLoading(true);
  };

  return (
    <div className="landing-container">
      {loading && <Loader />}
      <video autoPlay loop muted className="background-video">
        <source src={bgVideo} type="video/mp4" />
      </video>
      <nav className="navbarLanding">
        <img src={Logo} alt="Logo" className="logoLanding" />
      </nav>
      <motion.div 
        className="content"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="tagline">
          Track Your Spending <br /> Save Your Future
        </h1>
        <div className="buttons">
          <motion.button
            onClick={() => handleClick('/login')}
            className="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="fas fa-sign-in-alt"></i> Login
          </motion.button>
          <motion.button
            onClick={() => handleClick('/register')}
            className="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className="fas fa-user-plus"></i> Register
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
