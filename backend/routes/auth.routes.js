const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UserModel} = require('../models/user.model');
require('dotenv').config();

const userRouter = express.Router();

// Sign Up Route
userRouter.post('/signup', async (req, res) => {
  const { name, email, password, course, role = 'Student' } = req.body; // Default role here
  try {
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    if (role === 'Student' && !course) {
      return res.status(400).json({ message: 'Course is required for Student role' });
    }
    if (!['Admin', 'Student'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      course: role === 'Student' ? course : null,
      role,
    });

    // Save user to database
    await newUser.save();

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in .env');
    }
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Send response
    res.status(201).json({
      message: 'Successfully signed up',
      token,
      user: {
        id: newUser._id,
        name,
        email,
        role: newUser.role,
        course: newUser.course,
        enrollmentDate: newUser.enrollmentDate,
      },
    });
  } catch (error) {
    console.error('Signup Error:', error.message, error.stack);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login Route
userRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in .env');
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).json({
      message: 'Successfully logged in',
      token,
      user: {
        id: user._id,
        name: user.name,
        email,
        role: user.role,
        course: user.course,
        enrollmentDate: user.enrollmentDate,
      },
    });
  } catch (error) {
    console.error('Login Error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = {userRouter};