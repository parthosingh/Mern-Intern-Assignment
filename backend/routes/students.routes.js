//  const express = require('express');
//  const bcrypt = require('bcryptjs');
//  const {UserModel} = require('../models/user.model');
//  const { auth, restrictTo } = require('../middleware/auth.middleware');

//  const studentRouter = express.Router();

// //  Get all students (Admin only)
//  studentRouter.get('/', auth, restrictTo('Admin'), async (req, res) => {
//    try {
//      const students = await UserModel.find({ role: 'Student' }).select('-password');
//      res.status(200).json(students);
//    } catch (error) {
//      console.error('Get All Students Error:', error.message, error.stack);
//      res.status(500).json({ message: 'Server error', error: error.message });
//    }
//  });

// //  Create student (Admin only)
//  studentRouter.post('/', auth, restrictTo('Admin'), async (req, res) => {
//    const { name, email, password, course } = req.body;
//    try {
//      const existingUser = await UserModel.findOne({ email });
//      if (existingUser) {
//        return res.status(400).json({ message: 'User already exists' });
//      }
//      const hashedPassword = await bcrypt.hash(password, 10);
//      const newStudent = new UserModel({
//        name,
//        email,
//        password: hashedPassword,
//        course,
//        role: 'Student',
//      });
//      await newStudent.save();
//      res.status(201).json({
//        message: 'Successfully created student',
//        user: {
//          id: newStudent._id,
//          name,
//          email,
//          role: newStudent.role,
//          course,
//          enrollmentDate: newStudent.enrollmentDate,
//        },
//      });
//    } catch (error) {
//      console.error('Create Student Error:', error.message, error.stack);
//      if (error.code === 11000) {
//        return res.status(400).json({ message: 'Email already exists' });
//      }
//      res.status(500).json({ message: 'Server error', error: error.message });
//    }
//  });

// //  Update student (Admin only)
//  studentRouter.put('/:id', auth, restrictTo('Admin'), async (req, res) => {
//    const { name, email, course } = req.body;
//    try {
//      const user = await UserModel.findById(req.params.id);
//      if (!user || user.role !== 'Student') {
//        return res.status(404).json({ message: 'Student not found' });
//      }
//      if (name) user.name = name;
//      if (email && email !== user.email) {
//        const existingEmail = await UserModel.findOne({ email, _id: { $ne: user._id } });
//        if (existingEmail) {
//          return res.status(400).json({ message: 'Email already exists' });
//        }
//        user.email = email;
//      }
//      if (course) user.course = course;
//      await user.save();
//      res.status(200).json({
//        message: 'Successfully updated student',
//        user: {
//          id: user._id,
//          name: user.name,
//          email: user.email,
//          role: user.role,
//          course: user.course,
//          enrollmentDate: user.enrollmentDate,
//        },
//      });
//    } catch (error) {
//      console.error('Update Student Error:', error.message, error.stack);
//      if (error.name === 'CastError') {
//        return res.status(400).json({ message: 'Invalid student ID' });
//      }
//      if (error.code === 11000) {
//        return res.status(400).json({ message: 'Email already exists' });
//      }
//      res.status(500).json({ message: 'Server error', error: error.message });
//    }
//  });

// //  Delete student (Admin only)
//  studentRouter.delete('/:id', auth, restrictTo('Admin'), async (req, res) => {
//    try {
//      const user = await UserModel.findById(req.params.id);
//      if (!user || user.role !== 'Student') {
//        return res.status(404).json({ message: 'Student not found' });
//      }
//      await user.deleteOne();
//      res.status(200).json({ message: 'Student deleted' });
//    } catch (error) {
//      console.error('Delete Student Error:', error.message, error.stack);
//      if (error.name === 'CastError') {
//        return res.status(400).json({ message: 'Invalid student ID' });
//      }
//      res.status(500).json({ message: 'Server error', error: error.message });
//    }
//  });

// //  Get own profile (Student only)
//  studentRouter.get('/profile', auth, restrictTo('Student'), async (req, res) => {
//    try {
//      const user = await UserModel.findById(req.user.id).select('-password');
//      if (!user) return res.status(404).json({ message: 'User not found' });
//      res.status(200).json({
//        message: 'Successfully retrieved profile',
//        user: {
//          id: user._id,
//          name: user.name,
//          email: user.email,
//          role: user.role,
//          course: user.course,
//          enrollmentDate: user.enrollmentDate,
//        },
//      });
//    } catch (error) {
//      console.error('Get Profile Error:', error.message, error.stack);
//      res.status(500).json({ message: 'Server error', error: error.message });
//    }
//  });

// //  Update own profile (Student only)
//  studentRouter.put('/profile', auth, restrictTo('Student'), async (req, res) => {
//    const { name, email, course } = req.body;
//    try {
//      const user = await UserModel.findById(req.user.id);
//      if (!user) return res.status(404).json({ message: 'User not found' });
//      if (name) user.name = name;
//      if (email && email !== user.email) {
//        const existingEmail = await UserModel.findOne({ email, _id: { $ne: user._id } });
//        if (existingEmail) {
//          return res.status(400).json({ message: 'Email already exists' });
//        }
//        user.email = email;
//      }
//      if (course) user.course = course;
//      await user.save();
//      res.status(200).json({
//        message: 'Successfully updated profile',
//        user: {
//          id: user._id,
//          name: user.name,
//          email: user.email,
//          role: user.role,
//          course: user.course,
//          enrollmentDate: user.enrollmentDate,
//        },
//      });
//    } catch (error) {
//      console.error('Update Profile Error:', error.message, error.stack);
//      if (error.code === 11000) {
//        return res.status(400).json({ message: 'Email already exists' });
//      }
//      res.status(500).json({ message: 'Server error', error: error.message });
//    }
//  });

//  module.exports = {studentRouter};


const express = require('express');
const bcrypt = require('bcryptjs');
const { UserModel } = require('../models/user.model');
const { auth, restrictTo } = require('../middleware/auth.middleware');

const studentRouter = express.Router();

// Get all students (Admin only)
studentRouter.get('/', auth, restrictTo('Admin'), async (req, res) => {
  try {
    const students = await UserModel.find({ role: 'Student' }).select('-password');
    res.status(200).json(students);
  } catch (error) {
    console.error('Get All Students Error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create student (Admin only)
studentRouter.post('/', auth, restrictTo('Admin'), async (req, res) => {
  const { name, email, password, course } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new UserModel({
      name,
      email,
      password: hashedPassword,
      course,
      role: 'Student',
    });
    await newStudent.save();
    res.status(201).json({
      message: 'Successfully created student',
      user: {
        id: newStudent._id,
        name,
        email,
        role: newStudent.role,
        course,
        enrollmentDate: newStudent.enrollmentDate,
      },
    });
  } catch (error) {
    console.error('Create Student Error:', error.message, error.stack);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update student (Admin only)
studentRouter.put('/:id', auth, restrictTo('Admin'), async (req, res) => {
  const { name, email, course } = req.body;
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user || user.role !== 'Student') {
      return res.status(404).json({ message: 'Student not found' });
    }
    if (name) user.name = name;
    if (email && email !== user.email) {
      const existingEmail = await UserModel.findOne({ email, _id: { $ne: user._id } });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      user.email = email;
    }
    if (course) user.course = course;
    await user.save();
    res.status(200).json({
      message: 'Successfully updated student',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        course: user.course,
        enrollmentDate: user.enrollmentDate,
      },
    });
  } catch (error) {
    console.error('Update Student Error:', error.message, error.stack);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete student (Admin only)
studentRouter.delete('/:id', auth, restrictTo('Admin'), async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user || user.role !== 'Student') {
      return res.status(404).json({ message: 'Student not found' });
    }
    await user.deleteOne();
    res.status(200).json({ message: 'Student deleted' });
  } catch (error) {
    console.error('Delete Student Error:', error.message, error.stack);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get own profile (Student only)
studentRouter.get('/profile', auth, restrictTo('Student'), async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({
      message: 'Successfully retrieved profile',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        course: user.course,
        enrollmentDate: user.enrollmentDate,
      },
    });
  } catch (error) {
    console.error('Get Profile Error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update own profile (Student only)
studentRouter.put('/profile', auth, restrictTo('Student'), async (req, res) => {
  console.log('PUT /profile - Route reached (auth and restrictTo passed)');  // Debug: Middleware passed
  const { name, email, course } = req.body;
  console.log('PUT /profile - req.user from middleware:', req.user);  // Debug: ID and role from auth
  console.log('PUT /profile - Body:', { name, email, course });  // Debug: Request body
  try {
    const user = await UserModel.findById(req.user.id);
    console.log('PUT /profile - DB user fetched:', user ? { id: user._id, role: user.role, email: user.email } : 'NULL');  // Debug: DB fetch result
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name) user.name = name;
    if (email && email !== user.email) {
      const existingEmail = await UserModel.findOne({ email, _id: { $ne: user._id } });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      user.email = email;
    }
    if (course) user.course = course;
    await user.save();
    console.log('PUT /profile - Save successful, updated user:', { id: user._id, name: user.name, email: user.email, role: user.role });  // Debug: Success
    res.status(200).json({
      message: 'Successfully updated profile',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        course: user.course,
        enrollmentDate: user.enrollmentDate,
      },
    });
  } catch (error) {
    console.error('Update Profile Error:', error.message, error.stack);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = { studentRouter };