const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/userModel');
const checkAuth = require('../middlewares/checkAuthToken');
const responseFunction = require('../utils/responseFunction');

const router = express.Router();

// Test route to verify profile routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'Profile routes are working!' });
});

// Configure multer for avatar upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, '../../uploads/avatars');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Update Profile Route
router.put('/updateprofile', checkAuth, upload.single('avatar'), async (req, res) => {
  try {
    const { name, bio, phone, location } = req.body;
    const userId = req.userId;

    // Get current user
    const user = await User.findById(userId);
    if (!user) {
      return responseFunction(res, 404, 'User not found', null, false);
    }

    // Prepare update data
    const updateData = {};
    
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (phone !== undefined) updateData.phone = phone;
    if (location !== undefined) updateData.location = location;

    // Handle avatar upload
    if (req.file) {
      // Delete old avatar if it exists
      if (user.avatar && user.avatar !== '/default-avatar.png') {
        const oldAvatarPath = path.join(__dirname, '../../uploads/avatars', path.basename(user.avatar));
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }
      
      // Set new avatar path
      updateData.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');

    return responseFunction(res, 200, 'Profile updated successfully', updatedUser, true);

  } catch (error) {
    // Handle multer errors
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return responseFunction(res, 400, 'File too large. Maximum size is 5MB.', null, false);
      }
      return responseFunction(res, 400, 'File upload error: ' + error.message, null, false);
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return responseFunction(res, 400, 'Validation error: ' + validationErrors.join(', '), null, false);
    }

    console.error('Profile update error:', error);
    return responseFunction(res, 500, 'Internal server error', null, false);
  }
});

// Get Profile Stats Route
router.get('/profile-stats', checkAuth, async (req, res) => {
  try {
    const userId = req.userId;
    
    // Import models (you may need to adjust paths)
    const Classroom = require('../models/classroomModel');
    const ClassroomJoin = require('../models/classroomJoinModel');
    
    const user = await User.findById(userId);
    if (!user) {
      return responseFunction(res, 404, 'User not found', null, false);
    }

    let stats = {
      totalClasses: 0,
      joinedClasses: 0,
      completedAssignments: 0,
      totalQuizzes: 0
    };

    if (user.role === 'teacher') {
      // Get classes created by teacher
      const createdClasses = await Classroom.find({ createdBy: userId });
      stats.totalClasses = createdClasses.length;
      
      // TODO: Add assignment and quiz counts from your existing models
      stats.completedAssignments = 0; // Placeholder
      stats.totalQuizzes = 0; // Placeholder
      
    } else {
      // Get classes joined by student
      const joinedClasses = await ClassroomJoin.find({ userId: userId });
      stats.joinedClasses = joinedClasses.length;
      
      // TODO: Add assignment and quiz counts from your existing models
      stats.completedAssignments = 0; // Placeholder
      stats.totalQuizzes = 0; // Placeholder
    }

    return responseFunction(res, 200, 'Stats retrieved successfully', stats, true);

  } catch (error) {
    console.error('Stats retrieval error:', error);
    return responseFunction(res, 500, 'Internal server error', null, false);
  }
});

module.exports = router;