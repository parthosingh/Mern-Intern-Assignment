

const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/user.model');
require('dotenv').config();

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid token format' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth - Decoded from JWT:', decoded);  // Debug

    const user = await UserModel.findById(decoded.id);
    console.log('Auth - User from DB:', user ? { id: user._id, role: user.role } : 'NULL');  // Debug

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      id: decoded.id,
      role: user.role,
    };
    console.log('Auth - Set req.user role:', req.user.role);  // Debug

    next();
  } catch (error) {
    console.error('Auth Error:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const restrictTo = (allowedRoles) => {
  return (req, res, next) => {
    console.log('restrictTo - Checking role:', req.user.role, 'against allowed:', allowedRoles);  // Debug
    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      console.log('restrictTo - Access denied for role:', req.user.role);  // Debug
      return res.status(403).json({ message: 'Access denied' });
    }
  };
};

module.exports = { auth, restrictTo };
