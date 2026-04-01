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

// registration
exports.showRegisterForm = (req, res) => {
  res.render('register', { questions: SECURITY_QUESTIONS, error: null });
};

exports.registerUser = async (req, res) => {
  try {
    
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const question1 = req.body.question1;
    const answer1 = req.body.answer1;
    const question2 = req.body.question2;
    const answer2 = req.body.answer2;
    const question3 = req.body.question3;
    const answer3 = req.body.answer3;

    if (!username || !email || !password || !confirmPassword) {
      error =  'All fields are required.' 
      return res.render('register', { questions: SECURITY_QUESTIONS, error});
    }
    if (password !== confirmPassword) {
      return res.render('register', { questions: SECURITY_QUESTIONS, error: 'Passwords do not match.' });
    }
    const selectedQuestions = [question1, question2, question3];
    

    //do not need because 
    //if (selectedQuestions.some(q => !q) || new Set(selectedQuestions).size !== 3) {
      
    //   error = 'Please select three distinct security questions.'
    //   return res.render('register', { questions: SECURITY_QUESTIONS, error });
    // }

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

// login page
exports.showLoginForm = (req, res) => {
  res.render('login', { error: null });
};

exports.loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
   
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

// logout
exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.redirect('/recipe');
    }
    res.redirect('/login');
  });
};

// forgot password
exports.showForgotForm = (req, res) => {
  res.render('forgot', { error: null, message: null });
};

//then they come here if they forgot
exports.handleForgot = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findByEmail(email);
    if (!user) {
      let error = "No account found with that email."
      let message = null;
      return res.render('forgot', { error , message });
    }
    //occurs if the user is created by the admin so no security
    if (!user.security_questions || !Array.isArray(user.security_questions) || user.security_questions.length !== 3) {
      let error =  'This account does not have security questions set. Please contact support.';
      let message = null;
      return res.render('forgot', { error, message });
    }
    let useremail = user.email;
    let userQuestions = user.security_questions;
    let error = null;
    res.render('reset-password', {
      email: useremail,
      userQuestions: userQuestions,
      error
    });
  } catch (err) {
    console.error(err);
    res.render('forgot', { error: 'Error processing request: ' + err.message , message: null }); 
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  try {
    
    const email = req.body.email;
    const newPassword = req.body.newPassword;
    const answer0 = req.body.answer0;
    const answer1 = req.body.answer1;
    const answer2 = req.body.answer2;

    if (!newPassword || !answer0 || !answer1 || !answer2) {
      const user = await User.findByEmail(email);
      let error = 'All fields are required.';

      return res.render('reset-password', {
        email,
        userQuestions: user ? user.security_questions : [],
        error
      });
    }

    const user = await User.findByEmailWithAnswers(email);
    if (!user)  {
      return res.redirect('/forgot')
    }

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
      let email = user.email;
      let userQuestions = user.security_questions;
      let error = 'One or more answers are incorrect.';
      return res.render('reset-password', {
        email,
        userQuestions,
        error
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(user._id, hashedPassword);
    let message = 'Password reset successfully. Please log in.';
    let error = null;
    res.render('login', { error , message});
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

// update user is for what
// exports.updateUser = async (req, res) => {
//   try {
//     const userId = req.session.userId;
 
//     const username = req.body.username;
//     const email = req.body.email;
//     if (!userId) {
//       return res.status(401).send('Not logged in.')
//     }
    
//     if (!username || !email) {
//       return res.status(400).send('Username and email are required.')
//     } 

//     await User.updateById(userId, { username, email });
//     res.redirect('/recipe');

//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error updating user: ' + err.message);
//   }
// };

// delete user do not need 
// exports.deleteUser = async (req, res) => {
//   try {
//     const userId = req.session.userId;
//     if (!userId) {
//       return res.status(401).send('Not logged in.')
//     }
//     await User.deleteById(userId);
//     req.session.destroy((err) => {
//       if (err) {
//         console.error(err)
//         res.send('Your account has been deleted.')
//       }
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error deleting user: ' + err.message);
//   }
// };

// profile
exports.showProfile = (req, res) => {
  let user = req.user;
  let error = null;
  let success = null;
  res.render('profile', {
    user,
    questions: SECURITY_QUESTIONS,
    error,
    success
  });
};

exports.changePassword = async (req, res) => {
  try {
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const confirmNewPassword = req.body.confirmNewPassword;
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
       let user = req.user
       let error = 'New passwords do not match.';
      return res.render('profile', {
        user,
        questions: SECURITY_QUESTIONS,
        error,
        success: null
      });
    }

    const user = await User.findByIdWithPassword(userId);
    if (!user) {
      return res.redirect('/login')
    }

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
    const updatedUser = await User.findByIdUser(userId);
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
    const oldAnswer1 = req.body.oldAnswer1;
    const oldAnswer2 = req.body.oldAnswer2;
    const oldAnswer3 = req.body.oldAnswer3;
    const newQuestion1 = req.body.newQuestion1;
    const newAnswer1 = req.body.newAnswer1;
    const newQuestion2 = req.body.newQuestion2;
    const newAnswer2 = req.body.newAnswer2;
    const newQuestion3 = req.body.newQuestion3;
    const newAnswer3 = req.body.newAnswer3;
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

    // const newQuestions = [newQuestion1, newQuestion2, newQuestion3];
    // if (new Set(newQuestions).size !== 3) {
    //   return res.render('profile', {
    //     user: req.user,
    //     questions: SECURITY_QUESTIONS,
    //     error: 'Please select three distinct security questions.',
    //     success: null
    //   });
    // }

    // const user = await User.findByIdWithAnswers(userId);
    // if (!user) return res.redirect('/login');

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
    const updatedUser = await User.findByIdUser(userId);
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