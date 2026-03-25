// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ==================== REGISTRATION ====================
router.get('/register', authController.showRegisterForm);
router.post('/register', authController.registerUser);

// ==================== LOGIN ====================
router.get('/login', authController.showLoginForm);
router.post('/login', authController.loginUser);

// ==================== LOGOUT ====================
router.get('/logout', authController.logoutUser);

// ==================== FORGOT & RESET PASSWORD ====================
router.get('/forgot', authController.showForgotForm);
router.post('/forgot', authController.handleForgot);
router.post('/reset-password', authController.resetPassword);

// ==================== UPDATE & DELETE USER ====================
// For RESTful APIs, use PUT and DELETE. For traditional form submissions, use POST.
// The examples below use POST for simplicity (since forms typically support GET/POST only).
// You can adjust based on your form method attribute.
router.post('/user/update', authController.updateUser);
router.post('/user/delete', authController.deleteUser);

module.exports = router;