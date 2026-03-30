const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// All admin routes require isAuthenticated and isAdmin
router.use(authMiddleware.isAuthenticated, authMiddleware.isAdmin);

// User management
router.get('/admin/users', adminController.showAdminUsers);
router.get('/admin/users/new', adminController.createUserForm);
router.post('/admin/users', adminController.createUser);
router.get('/admin/users/:id/edit', adminController.editUserForm);
router.post('/admin/users/:id', adminController.updateUser);
router.post('/admin/users/:id/delete', adminController.deleteUser);

// Admin dashboard (landing page)
router.get('/admin', authMiddleware.isAuthenticated, authMiddleware.isAdmin, adminController.showAdminDashboard);

module.exports = router;