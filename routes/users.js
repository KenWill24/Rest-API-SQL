//load modules
'use strict';
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const authenticateUser = require('../middleware/authenticateUser');

/**
 * GET /api/users
 * Return the currently authenticated user
 */
router.get('/users', authenticateUser, async (req, res, next) => {
  try {
    const user = req.currentUser;

    res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/users
 * Create a new user
 */
router.post('/users', async (req, res, next) => {
  try {
    const { firstName, lastName, emailAddress, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !emailAddress || !password) {
      return res.status(400).json({
        message: 'All fields (firstName, lastName, emailAddress, password) are required.'
      });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create user
    await User.create({
      firstName,
      lastName,
      emailAddress,
      password: hashedPassword
    });

    // Set Location header
    res.location('/');
    res.status(201).end();
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ message: 'Email address already exists.' });
    } else if (error.name === "SequelizeValidationError") {
      res.status(400).json({ message: error.errors.map(e => e.message) });
    } else {
      next(error);
    }
  }
});

module.exports = router;