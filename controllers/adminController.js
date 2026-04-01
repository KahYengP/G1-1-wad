// controllers/adminController.js
const bcrypt = require('bcrypt');
const { getAll, findById, createUser, updateById, deleteById, countUsers } = require('../models/User');
const User = require('../models/User'); // needed for duplicate check with $or

// ========== LIST ALL USERS ==========
exports.showAdminUsers = async (req, res) => {
  try {
    const users = await getAll();
    res.render('admin-profile', { users, user: req.user });
  } catch (err) {
    res.status(500).send('Error loading admin page');
  }
};

// ========== CREATE USER FORM ==========
exports.createUserForm = (req, res) => {
  res.render('admin-user-form', { editingUser: null, error: null, isEdit: false });
};

// ========== CREATE USER (POST) ==========
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.render('admin-user-form', {
        editingUser: { username, email, role },
        error: 'All fields are required.',
        isEdit: false
      });
    }

    // Check for existing user (email or username)
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.render('admin-user-form', {
        editingUser: { username, email, role },
        error: 'Username or email already exists.',
        isEdit: false
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser({
      username,
      email,
      password: hashedPassword,
      role,
      security_questions: ['', '', ''],
      security_answers: ['', '', '']
    });

    res.redirect('/admin/users');
  } catch (err) {
    console.error(err);
    res.render('admin-user-form', {
      editingUser: req.body,
      error: 'Error creating user: ' + err.message,
      isEdit: false
    });
  }
};

// ========== EDIT USER FORM ==========
exports.editUserForm = async (req, res) => {
  try {
    const user = await findById(req.params.id);
    if (!user) {
      return res.redirect('/admin/users');
    }
    res.render('admin-user-form', { editingUser: user, error: null, isEdit: true });
  } catch (err) {
    res.status(500).send('Error loading edit form');
  }
};

// ========== UPDATE USER (POST) ==========
exports.updateUser = async (req, res) => {
  try {
    const { username, email, role, password } = req.body;
    const userId = req.params.id;

    const updateData = { username, email, role };
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await updateById(userId, updateData);
    res.redirect('/admin/users');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating user');
  }
};

// ========== DELETE USER ==========
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // Prevent admin from deleting themselves
    if (userId === req.user._id.toString()) {
      return res.status(403).send('You cannot delete your own account.');
    }
    await deleteById(userId);
    res.redirect('/admin/users');
  } catch (err) {
    res.status(500).send('Error deleting user');
  }
};

// ========== ADMIN DASHBOARD ==========
exports.showAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await countUsers();
    // If you have Recipe model, import and count totalRecipes
    // const totalRecipes = await Recipe.countDocuments();
    res.render('admin-dashboard', {
      totalUsers,
      // totalRecipes,
      user: req.user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading admin dashboard');
  }
};