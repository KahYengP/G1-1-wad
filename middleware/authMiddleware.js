const User = require("../models/User");

// Check if user is logged in (relies on global middleware)
exports.isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.redirect("/login");
  }
  if (!req.user) {
    return res.redirect("/login");
  }
  next();
};

// Redirect logged-in users away from login/register pages
exports.isGuest = (req, res, next) => {
  if (req.session && req.session.userId) {
    // Role-based redirection
    if (req.user && req.user.role === 'admin') {
      return res.redirect('/admin');      // admin dashboard
    } else {
      return res.redirect('/recipe');     // regular user recipe list
    }
  }
  next();
};

// Admin check – uses req.user from global middleware
exports.isAdmin = (req, res, next) => {
  if (!req.session || !req.session.userId) return res.redirect("/login");
  if (req.user && req.user.role === "admin") return next();
  res.status(403).send("Access denied");
};

exports.setUser = async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findByIdUser(req.session.userId);
      req.user = user;
    } catch (e) {}
  }
  next();
};


