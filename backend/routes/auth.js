// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../data/users.json');

// Register API
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const users = JSON.parse(fs.readFileSync(usersFile));

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    id: Date.now(),
    username,
    email,
    password: hashedPassword,
  };

  users.push(newUser);
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  res.status(201).json({ message: 'User registered successfully' });
});
// routes/auth.js
router.post('/login', (req, res) => {
    console.log('Login attempt:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const users = JSON.parse(fs.readFileSync(usersFile));
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  // Simulate JWT (for demo)
  const token = `${user.id}-${Date.now()}`;

  res.json({ message: 'Login successful', token, user: { id: user.id, username: user.username, email: user.email } });
});

module.exports = router;
