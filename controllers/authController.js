
const User = require('../models/User');
const bcrypt = require('bcrypt');

// List of available security questions (10 questions)
const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "What was the model of your first car?",
  "What city were you born in?",
  "What was your childhood nickname?",
  "What is the name of your favorite teacher?",
  "What was your first job?",
  "What is your favorite book?",
  "What is the name of the street you grew up on?",
  "What was the make of your first mobile phone?"
];

// ==================== REGISTRATION ====================
// GET /register - display registration form with security questions
exports.showRegisterForm = (req, res) => {
  res.render('register', { questions: SECURITY_QUESTIONS, error: null });
};

// POST /register - process registration
// controllers/authController.js (partial update)

// controllers/authController.js

exports.registerUser = async (req, res) => {
  try { 
    const {
      username, email, password, confirmPassword,
      question1, answer1, question2, answer2, question3, answer3,role
    } = req.body;
  

    // 1. Required fields
    if (!username || !email || !password || !confirmPassword) {
      return res.render('register', {
        questions: SECURITY_QUESTIONS,
        error: 'All fields are required.'
      });
    }

    // 2. Password match
    if (password !== confirmPassword) {
      return res.render('register', {
        questions: SECURITY_QUESTIONS,
        error: 'Passwords do not match.'
      });
    }

    // 3. Security questions validation
    const selectedQuestions = [question1, question2, question3];
    if (selectedQuestions.some(q => !q) || new Set(selectedQuestions).size !== 3) {
      return res.render('register', {
        questions: SECURITY_QUESTIONS,
        error: 'Please select three distinct security questions.'
      });
    }

    // 4. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', {
        questions: SECURITY_QUESTIONS,
        error: 'User already exists.'
      });
    }

    // 5. Hash password and answers
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAnswers = await Promise.all([
      bcrypt.hash(answer1, 10),
      bcrypt.hash(answer2, 10),
      bcrypt.hash(answer3, 10)
    ]);

    // 6. Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: req.body.role,
      security_questions: selectedQuestions,
      security_answers: hashedAnswers
    });
    await user.save();

    // 7. Redirect to login page on success
    return res.redirect('/login');
  } catch (err) {
    console.error('Registration error:', err);
    // If error, re-render with error message
    return res.render('register', {
      questions: SECURITY_QUESTIONS,
      error: 'Error registering user: ' + err.message
    });
  }
};
// ==================== LOGIN ====================
// GET /login - display login form
exports.showLoginForm = (req, res) => {
  res.render('login', { error: null });
};

// POST /login - authenticate user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', { error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { error: 'Invalid email or password.' });
    }

    // Save user ID in session
    req.session.userId = user._id;
    //res.redirect('/dashboard'); dashboard doesnt work now
    res.redirect('/dashboard')
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Error logging in: ' + err.message });
  }
};

// ==================== LOGOUT ====================
// GET /logout - destroy session and redirect to login
exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.redirect('/dashboard');
    }
    res.redirect('/login');
  });
};

exports.showLogoutPage = (req, res) => {
  // Optional: redirect to login if user is not logged in
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  res.render('logout');
};

// ==================== FORGOT PASSWORD ====================
// GET /forgot - display email entry form
exports.showForgotForm = (req, res) => {
  res.render('forgot', { error: null, message: null });
};

// POST /forgot - handle email submission, show security questions
exports.handleForgot = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('forgot', {
        error: 'No account found with that email.',
        message: null
      });
    }

    
    if (!user.security_questions || !Array.isArray(user.security_questions) || user.security_questions.length !== 3) {
      return res.render('forgot', {
        error: 'This account does not have security questions set. Please contact support.',
        message: null
      });
    }

    res.render('reset-password', {
      email: user.email,
      userQuestions: user.security_questions,   // now safe
      error: null
    });
  } catch (err) {
    console.error(err);
    res.render('forgot', {
      error: 'Error processing request: ' + err.message,
      message: null
    });
  }
};

// ==================== RESET PASSWORD ====================
// POST /reset-password - verify answers and set new password
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, answer0, answer1, answer2 } = req.body;

    // Basic validation
    if (!newPassword || !answer0 || !answer1 || !answer2) {
      const user = await User.findOne({ email });
      return res.render('reset-password', {
        email,
        userQuestions: user ? user.security_questions : [],
        error: 'All fields are required.'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.redirect('/forgot');
    }

    // Verify answers in the stored order
    const answers = [answer0, answer1, answer2];
    let allMatch = true;
    for (let i = 0; i < answers.length; i++) {
      const match = await bcrypt.compare(answers[i], user.security_answers[i]);
      if (!match) {
        allMatch = false;
        break;
      }
    }

    if (!allMatch) {
      return res.render('reset-password', {
        email: user.email,
        userQuestions: user.security_questions,
        error: 'One or more answers are incorrect.'
      });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Redirect to login with success message (optional)
    res.render('login', { error: null, message: 'Password reset successfully. Please log in.' });
  } catch (err) {
    console.error(err);
    // Attempt to retrieve user again to render the form
    const user = await User.findOne({ email: req.body.email });
    res.render('reset-password', {
      email: req.body.email || '',
      userQuestions: user ? user.security_questions : [],
      error: 'Error resetting password: ' + err.message
    });
  }
};

// ==================== USER UPDATE & DELETE ====================
// POST /user/update - update username or email
exports.updateUser = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { username, email } = req.body;

    if (!userId) {
      return res.status(401).send('Not logged in.');
    }

    if (!username || !email) {
      return res.status(400).send('Username and email are required.');
    }

    await User.findByIdAndUpdate(userId, { username, email });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating user: ' + err.message);
  }
};

// POST /user/delete - delete user account
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).send('Not logged in.');
    }

    await User.findByIdAndDelete(userId);
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error deleting account.');
      }
      res.send('Your account has been deleted.');
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting user: ' + err.message);
  }
};