const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET);
};

const signup = async (req, res) => {
  const { email, username, password, confirmPassword } = req.body;

  try {
    const user = await User.signup(email, username, password, confirmPassword);

    const token = createToken(user._id);

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const user = await User.login(emailOrUsername, password);

    const token = createToken(user._id);

    res.status(200).json({ email: user.email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signup, login };
