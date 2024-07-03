// Loader.js
import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../../assets/Animation - 1719913695894.json';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <Lottie animationData={animationData} loop={true} className="loader-animation" />
    </div>
  );
};

export default Loader;
