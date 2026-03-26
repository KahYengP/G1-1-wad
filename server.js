const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');

const authRoute = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes')
const bookmarkRoutes = require('./routes/bookmarkRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')



dotenv.config({ path: "./config.env" });

const server = express();

// ========== MIDDLEWARE (MUST BE BEFORE ROUTES) ==========
// Body parser for form data (HTML forms)
server.use(express.urlencoded({ extended: true }));
// Body parser for JSON (if needed)
server.use(express.json());

// Session middleware – must be before any route that uses req.session
server.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: false
}));

// ========== VIEW ENGINE ==========
server.set('view engine', 'ejs');

// ========== ROUTES (after all middleware) ==========
server.get("/",(req,res)=>{
    res.redirect("/login")
})
server.use('/dashboard',dashboardRoutes);
server.use('/recipe', recipeRoutes);
server.use('/', authRoute);
server.use('/', bookmarkRoutes)
// ========== DATABASE CONNECTION & SERVER START ==========

async function connectDataBase() {
  try {
    await mongoose.connect(process.env.DB);
    console.log('Successfully connected to database');
  } catch (error) {
    console.log('Failed to connect to database:', error);
  }
}

function startserver() {
  const port = 8000;
  const hostname = 'localhost';
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
  });
}

connectDataBase().then(startserver);