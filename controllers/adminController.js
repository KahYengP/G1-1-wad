const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.showAdminUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.render("admin-profile", { users, user: req.user });
  } catch (err) {
    res.send("Error loading admin page");
  }
};

exports.createUserForm = (req, res) => {
  res.render("admin-user-form", {
    editingUser: null,
    error: null,
    isEdit: false,
    user: req.user,
  });
};

exports.createUser = async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    if (!username || !email || !password || !role) {
      let error = "All fields are required.";
      let user = req.user;
      let isEdit = false;
      let editingUser = {
        username,
        email,
        role,
      };

      return res.render("admin-user-form", {
        editingUser,
        error,
        isEdit,
        user,
      });
    }

    const existingEmail = await User.findByEmail(email);
    const existingUsername = await User.findByUsername(username);
    if (existingEmail || existingUsername) {
      let editingUser = { username, email, role };
      let error = "Username or email already exists.";
      let user = req.user;
      let isEdit = false;
      return res.render("admin-user-form", {
        editingUser,
        error,
        isEdit,
        user,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.createUser({
      username,
      email,
      password: hashedPassword,
      role,
      security_questions: ["", "", ""],
      security_answers: ["", "", ""],
    });

    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.render("admin-user-form", {
      editingUser: req.body,
      error: "Error creating user: " + err.message,
      isEdit: false,
      user: req.user,
    });
  }
};

exports.editUserForm = async (req, res) => {
  try {
    const editingUser = await User.findByIdUser(req.query.id);
    if (!editingUser) {
      return res.redirect("/admin/users");
    }
    res.render("admin-user-form", {
      editingUser,
      error: null,
      isEdit: true,
      user: req.user,
    });
  } catch (err) {
    res.send("Error loading edit form");
  }
};

exports.updateUser = async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const role = req.body.role;
    const password = req.body.password;
    const userId = req.body.userId;
    const updateData = { username, email, role };
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }
    await User.updateById(userId, updateData);
    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.send("Error updating user");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (userId === req.user._id.toString()) {
      return res.send("You cannot delete your own account.");
    }
    await User.deleteById(userId);
    res.redirect("/admin/users");
  } catch (err) {
    res.send("Error deleting user");
  }
};

