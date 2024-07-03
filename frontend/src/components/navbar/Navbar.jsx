import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaTachometerAlt, FaMoneyCheckAlt, FaMoneyBillAlt } from 'react-icons/fa';
import './Navbar.css';
import Logo from '../../assets/Logo.png';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoaderAnimation from '../Loader/Loader'; 
const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const location = useLocation(); 

 
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
   
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
    setLoading(true); 
   
    setTimeout(() => {
    
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    
      navigate('/login');
      setLoading(false); 
    }, 3000); 
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


  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);


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
      {loading && <LoaderAnimation />} 
    </nav>
  );
};

export default Navbar;
