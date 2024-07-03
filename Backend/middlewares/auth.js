const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET; // Ensure jwtSecret is correctly imported

const authMiddleware = (req, res, next) => {
  // Check if there is a token in the headers
  const token = req.header('Authorization')?.replace('Bearer ', '');
   // Log the token here

  if (!token) {
    return res.status(401).json({ message: 'Authorization denied. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user; // Assuming your JWT payload has a 'user' field
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({ message: 'Token is not valid.' });
  }
};

module.exports = authMiddleware;
