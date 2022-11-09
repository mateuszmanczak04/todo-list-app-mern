const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { default: isEmail } = require('validator/lib/isemail');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.signup = async function (
  email,
  username,
  password,
  confirmPassword
) {
  if (!email || !username || !password) {
    throw Error('Email, username or password missing');
  }

  if (!validator.isEmail(email)) {
    throw Error('Please provide valid email');
  }

  let exists = await this.findOne({ email });
  if (exists) {
    throw Error('Email already taken');
  }

  exists = await this.findOne({ username });
  if (exists) {
    throw Error('Username already taken');
  }

  if (password.length < 6) {
    console.log(password);
    throw Error('Your password must include at least 6 characters');
  }

  if (password !== confirmPassword) {
    throw Error('Passwords do not match');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, username, password: hash });

  return user;
};

userSchema.statics.login = async function (emailOrUsername, password) {
  if (!emailOrUsername || !password) {
    throw Error('No email/username or password');
  }

  let user = null;
  if (isEmail(emailOrUsername)) {
    user = await this.findOne({ email: emailOrUsername });
  } else {
    user = await this.findOne({ username: emailOrUsername });
  }

  if (!user) {
    throw Error('Incorrect email or username');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error('Incorrect password');
  }

  return user;
};

module.exports = mongoose.model('User', userSchema);
