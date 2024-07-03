import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaTachometerAlt, FaMoneyCheckAlt, FaMoneyBillAlt } from 'react-icons/fa';
import './Navbar.css';
import Logo from '../../assets/Logo.png';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion from Framer Motion
import LoaderAnimation from '../Loader/Loader'; // Replace with your loader component

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false); // State to manage loading animation
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const location = useLocation(); // React Router hook to get current location

  // Initialize activeLink based on current location
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    // Retrieve the username from local storage or wherever it is stored
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    setLoading(true); // Show loading animation

    // Simulate logout delay
    setTimeout(() => {
      // Remove the token and username from local storage
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      // Redirect to the login page
      navigate('/login');
      setLoading(false); // Hide loading animation after logout
    }, 3000); // Simulate loading for 3 seconds
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Update activeLink whenever location changes
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  // Framer Motion variants for navbar links
  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/dashboard">
          <img src={Logo} alt="Logo" />
        </Link>
      </div>
      <div className="navbar-center">
        <motion.div
          variants={navItemVariants}
          initial="hidden"
          animate="visible"
          className={`nav-item ${activeLink === '/dashboard' ? 'active' : ''}`}
        >
          <Link to="/dashboard">
            <FaTachometerAlt className="navbar-icon" /> Dashboard
          </Link>
        </motion.div>
        <motion.div
          variants={navItemVariants}
          initial="hidden"
          animate="visible"
          className={`nav-item ${activeLink === '/income' ? 'active' : ''}`}
        >
          <Link to="/income">
            <FaMoneyCheckAlt className="navbar-icon" /> Incomes
          </Link>
        </motion.div>
        <motion.div
          variants={navItemVariants}
          initial="hidden"
          animate="visible"
          className={`nav-item ${activeLink === '/expenses' ? 'active' : ''}`}
        >
          <Link to="/expenses">
            <FaMoneyBillAlt className="navbar-icon" /> Expenses
          </Link>
        </motion.div>
      </div>
      <div className="navbar-profile">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <FaUserCircle onClick={toggleDropdown} className="profile-icon" />
        </motion.div>
        <motion.div
          ref={dropdownRef}
          className={`dropdown ${dropdownOpen ? 'open' : ''}`}
          initial="hidden"
          animate={dropdownOpen ? 'visible' : 'hidden'}
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
          }}
        >
          <div className="dropdown-userinfo">
            <FaUserCircle className="dropdown-icon" />
            <p className="dropdown-username">Hello, {username}</p>
          </div>
          <hr className="dropdown-divider" />
          <ul className="dropdown-menu">
            <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <button onClick={handleLogout}>Logout</button>
            </motion.li>
          </ul>
        </motion.div>
      </div>
      {loading && <LoaderAnimation />} {/* Show loader animation while logging out or navigating */}
    </nav>
  );
};

export default Navbar;
