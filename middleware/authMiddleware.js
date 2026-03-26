const User = require('../models/User'); // adjust path if needed

// Check if user is logged in (session exists)
exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect('/login');
};

// Redirect logged-in users away from login/register pages
exports.isGuest = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.redirect('/dashboard');
  }
  next();
};

// Optional: admin check
exports.isAdmin = async (req, res, next) => {
  if (!req.session || !req.session.userId) return res.redirect('/login');
  try {
    const user = await User.findById(req.session.userId);
    if (user && user.role === 'admin') return next();
    res.status(403).send('Access denied');
  } catch (err) {
    res.status(500).send('Server error');
  }
};