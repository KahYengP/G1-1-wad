const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');   // <-- add this line

// Public routes (only for guests)
router.get('/register', authMiddleware.isGuest, authController.showRegisterForm);
router.post('/register', authController.registerUser);

router.get('/login', authMiddleware.isGuest, authController.showLoginForm);
router.post('/login', authController.loginUser);

// Logout (requires session)
router.get('/logout', authController.showLogoutPage);
router.post('/logout', authController.logoutUser);

// Forgot / reset (public, but no need to protect)
router.get('/forgot', authController.showForgotForm);
router.post('/forgot', authController.handleForgot);
router.post('/reset-password', authController.resetPassword);

// User update/delete – you can protect these with isAuthenticated if needed
router.post('/user/update', authController.updateUser);
router.post('/user/delete', authController.deleteUser);


// Profile page (GET)
router.get('/profile', authMiddleware.isAuthenticated, authController.showProfile);

// Change password (POST)
router.post('/profile/change-password', authMiddleware.isAuthenticated, authController.changePassword);

// Change security questions (POST)
router.post('/profile/change-security', authMiddleware.isAuthenticated, authController.changeSecurity);

//logout
router.get('/logout', authController.logoutUser);  

module.exports = router;