const User = require("../models/User");
const bcrypt = require("bcrypt");
const { createAccessToken } = require("../utils/token");
const { validateEmail } = require("../utils/validation");

// Middleware for validating email and password
function validateCredentials(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ status: false, msg: "Please enter all details." });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ status: false, msg: "Invalid email format." });
  }

  if (password.length < 4) {
    return res.status(400).json({ status: false, msg: "Password length must be at least 4 characters." });
  }

  next(); // Continue to the next middleware or route handler
}

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate email and password
    validateCredentials(req, res, () => {});

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "This email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });
    res.status(200).json({ msg: "Congratulations! Your account has been created." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error." });
  }
};

exports.login = async (req, res) => {
  try {
    // Validate email and password
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, msg: "Please enter both email and password." });
    }

    // Add more validation rules if needed

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ status: false, msg: "This email is not registered." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: false, msg: "Incorrect password." });
    }

    const token = createAccessToken({ id: user._id });
    delete user.password;
    res.status(200).json({ token, user, status: true, msg: "Login successful." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, msg: "Internal Server Error." });
  }
};
