// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');

const SECURITY_QUESTIONS = [   "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "What was the model of your first car?",
  "What city were you born in?",
  "What was your childhood nickname?",
  "What is the name of your favorite teacher?",
  "What was your first job?",
  "What is your favorite book?",
  "What is the name of the street you grew up on?",
  "What was the make of your first mobile phone?"]; // unchanged

// ========== REGISTRATION ==========
exports.showRegisterForm = (req, res) => {
  res.render('register', { questions: SECURITY_QUESTIONS, error: null });
};

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, question1, answer1, question2, answer2, question3, answer3 } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.render('register', { questions: SECURITY_QUESTIONS, error: 'All fields are required.' });
    }
    if (password !== confirmPassword) {
      return res.render('register', { questions: SECURITY_QUESTIONS, error: 'Passwords do not match.' });
    }
    const selectedQuestions = [question1, question2, question3];
    if (selectedQuestions.some(q => !q) || new Set(selectedQuestions).size !== 3) {
      return res.render('register', { questions: SECURITY_QUESTIONS, error: 'Please select three distinct security questions.' });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.render('register', { questions: SECURITY_QUESTIONS, error: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAnswers = await Promise.all([
      bcrypt.hash(answer1, 10),
      bcrypt.hash(answer2, 10),
      bcrypt.hash(answer3, 10)
    ]);

    await User.createUser({
      username,
      email,
      password: hashedPassword,
      role: "user",
      security_questions: selectedQuestions,
      security_answers: hashedAnswers
    });

    return res.redirect('/login');
  } catch (err) {
    console.error('Registration error:', err);
    return res.render('register', { questions: SECURITY_QUESTIONS, error: 'Error registering user: ' + err.message });
  }
};

// ========== LOGIN ==========
exports.showLoginForm = (req, res) => {
  res.render('login', { error: null });
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmailWithPassword(email);
    if (!user) {
      return res.render('login', { error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { error: 'Invalid email or password.' });
    }

    req.session.userId = user._id;
    if (user.role === 'admin') {
      console.log('Logged in user role:', user.role);
      return res.redirect('/admin/users');
    } else {
      console.log('Logged in user role:', user.role);
      return res.redirect('/recipe');
    }
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Error logging in: ' + err.message });
  }
};

// ========== LOGOUT ==========
exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.redirect('/recipe');
    }
    res.redirect('/login');
  });
};

// ========== FORGOT PASSWORD ==========
exports.showForgotForm = (req, res) => {
  res.render('forgot', { error: null, message: null });
};

exports.handleForgot = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      return res.render('forgot', { error: 'No account found with that email.', message: null });
    }
    if (!user.security_questions || !Array.isArray(user.security_questions) || user.security_questions.length !== 3) {
      return res.render('forgot', { error: 'This account does not have security questions set. Please contact support.', message: null });
    }
    res.render('reset-password', {
      email: user.email,
      userQuestions: user.security_questions,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.render('forgot', { error: 'Error processing request: ' + err.message, message: null });
  }
};

// ========== RESET PASSWORD ==========
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, answer0, answer1, answer2 } = req.body;
    if (!newPassword || !answer0 || !answer1 || !answer2) {
      const user = await User.findByEmail(email);
      return res.render('reset-password', {
        email,
        userQuestions: user ? user.security_questions : [],
        error: 'All fields are required.'
      });
    }

    const user = await User.findByEmailWithAnswers(email);
    if (!user) return res.redirect('/forgot');

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

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(user._id, hashedPassword);
    res.render('login', { error: null, message: 'Password reset successfully. Please log in.' });
  } catch (err) {
    console.error(err);
    const user = await User.findByEmail(req.body.email);
    res.render('reset-password', {
      email: req.body.email || '',
      userQuestions: user ? user.security_questions : [],
      error: 'Error resetting password: ' + err.message
    });
  }
};

// ========== USER UPDATE & DELETE ==========
exports.updateUser = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { username, email } = req.body;
    if (!userId) return res.status(401).send('Not logged in.');
    if (!username || !email) return res.status(400).send('Username and email are required.');
    await User.updateById(userId, { username, email });
    res.redirect('/recipe');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating user: ' + err.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).send('Not logged in.');
    await User.deleteById(userId);
    req.session.destroy((err) => {
      if (err) console.error(err);
      res.send('Your account has been deleted.');
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting user: ' + err.message);
  }
};

// ========== PROFILE ==========
exports.showProfile = (req, res) => {
  res.render('profile', {
    user: req.user,
    questions: SECURITY_QUESTIONS,
    error: null,
    success: null
  });
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.session.userId;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.render('profile', {
        user: req.user,
        questions: SECURITY_QUESTIONS,
        error: 'All password fields are required.',
        success: null
      });
    }
    if (newPassword !== confirmNewPassword) {
      return res.render('profile', {
        user: req.user,
        questions: SECURITY_QUESTIONS,
        error: 'New passwords do not match.',
        success: null
      });
    }

    const user = await User.findByIdWithPassword(userId);
    if (!user) return res.redirect('/login');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.render('profile', {
        user: req.user,
        questions: SECURITY_QUESTIONS,
        error: 'Current password is incorrect.',
        success: null
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(userId, hashedNewPassword);
    const updatedUser = await User.findById(userId);
    req.user = updatedUser;

    res.render('profile', {
      user: updatedUser,
      questions: SECURITY_QUESTIONS,
      error: null,
      success: 'Password updated successfully.'
    });
  } catch (err) {
    console.error(err);
    res.render('profile', {
      user: req.user,
      questions: SECURITY_QUESTIONS,
      error: 'Error changing password: ' + err.message,
      success: null
    });
  }
};

exports.changeSecurity = async (req, res) => {
  try {
    const { oldAnswer1, oldAnswer2, oldAnswer3, newQuestion1, newAnswer1, newQuestion2, newAnswer2, newQuestion3, newAnswer3 } = req.body;
    const userId = req.session.userId;

    if (!oldAnswer1 || !oldAnswer2 || !oldAnswer3 ||
        !newQuestion1 || !newAnswer1 ||
        !newQuestion2 || !newAnswer2 ||
        !newQuestion3 || !newAnswer3) {
      return res.render('profile', {
        user: req.user,
        questions: SECURITY_QUESTIONS,
        error: 'All fields are required.',
        success: null
      });
    }

    const newQuestions = [newQuestion1, newQuestion2, newQuestion3];
    if (new Set(newQuestions).size !== 3) {
      return res.render('profile', {
        user: req.user,
        questions: SECURITY_QUESTIONS,
        error: 'Please select three distinct security questions.',
        success: null
      });
    }

    const user = await User.findByIdWithAnswers(userId);
    if (!user) return res.redirect('/login');

    const oldAnswers = [oldAnswer1, oldAnswer2, oldAnswer3];
    let allMatch = true;
    for (let i = 0; i < oldAnswers.length; i++) {
      const match = await bcrypt.compare(oldAnswers[i], user.security_answers[i]);
      if (!match) {
        allMatch = false;
        break;
      }
    }
    if (!allMatch) {
      return res.render('profile', {
        user: req.user,
        questions: SECURITY_QUESTIONS,
        error: 'One or more current answers are incorrect.',
        success: null
      });
    }

    const hashedNewAnswers = await Promise.all([
      bcrypt.hash(newAnswer1, 10),
      bcrypt.hash(newAnswer2, 10),
      bcrypt.hash(newAnswer3, 10)
    ]);

    await User.updateSecurityQuestions(userId, newQuestions, hashedNewAnswers);
    const updatedUser = await User.findById(userId);
    req.user = updatedUser;

    res.render('profile', {
      user: updatedUser,
      questions: SECURITY_QUESTIONS,
      error: null,
      success: 'Security questions updated successfully.'
    });
  } catch (err) {
    console.error(err);
    res.render('profile', {
      user: req.user,
      questions: SECURITY_QUESTIONS,
      error: 'Error updating security questions: ' + err.message,
      success: null
    });
  }
};