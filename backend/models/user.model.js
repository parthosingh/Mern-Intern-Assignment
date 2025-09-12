const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, enum: ['Admin', 'Student'], default: 'Student' },
      course: { type: String },
      enrollmentDate: { type: Date, default: function() { return this.role === 'Student' ? Date.now() : null; } }
    });

const UserModel = mongoose.model('User', userSchema);

module.exports = {UserModel};
