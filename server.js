const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const dotenv = require("dotenv");

// ===== ALL ROUTES =====
const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

dotenv.config({ path: "./config.env" });

const server = express();

// ========== MIDDLEWARE ==========
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

// Serve static files (images, css, etc.) from /public
server.use(express.static("public"));

// Session – must be before routes
server.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
  }),
);

// ========== VIEW ENGINE ==========
server.set("view engine", "ejs");

// ========== ROUTES ==========
server.use("/", authRoutes);
server.use("/recipe", recipeRoutes);
server.use("/", bookmarkRoutes);

// ========== DATABASE + START ==========
async function connectDataBase() {
  try {
    await mongoose.connect(process.env.DB);
    console.log("Successfully connected to database");
  } catch (error) {
    console.log("Failed to connect to database:", error);
  }
}

function startserver() {
  const port = 8000;
  const hostname = "localhost";
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
  });
}

connectDataBase().then(startserver);
