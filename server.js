const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const dotenv = require("dotenv");
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]); //to be deleted at the end 

// ===== ALL ROUTES =====
const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");
const mealPlannerRoutes = require("./routes/mealPlannerRoutes");

// ===== ENV =====
dotenv.config({ path: "./config.env" });

// ===== CREATE APP =====
const server = express();

// ========== MIDDLEWARE ==========
// 1. Body parsers
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

// 2. Static files to be deleted if no image
server.use(express.static("public"));

// 3. Session (must be before routes that use req.session)
const secret = process.env.SECRET;
server.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
  }),
);

// 4. Global user middleware (makes 'user' available in all views)
server.use(async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const User = require("./models/User");
      const user = await User.findByIdUser(req.session.userId);

      res.locals.user = user;
      req.user = user;
    } catch (err) {
      console.error("Error loading user in middleware:", err);
    }
  }
  next();
});

// ========== VIEW ENGINE ==========
server.set("view engine", "ejs");

// ========== ROUTES ==========
server.use("/", authRoutes);
server.use("/recipe", recipeRoutes);
server.use("/", bookmarkRoutes);
server.use("/", categoryRoutes);
server.use("/review", reviewRoutes);
server.use("/meal-planner", mealPlannerRoutes);
server.use("/", adminRoutes); // admin routes last (they contain /admin/*)

// ========== DATABASE CONNECTION ==========
async function connectDataBase() {
  try {
    await mongoose.connect(process.env.DB);
    console.log("Successfully connected to database");
  } catch (error) {
    console.log("Failed to connect to database:", error);
    process.exit(1);
  }
}

// ========== START SERVER ==========
function startserver() {
  const port = 8000;
  const hostname = "localhost";
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
  });
}

connectDataBase().then(startserver);
