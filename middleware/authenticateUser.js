// middleware/authenticateUser.js
'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  let message;
  const credentials = auth(req);
  //Parse credentials from Auth header
  if (credentials) {
    const user = await User.findOne({ where: { emailAddress: credentials.name } });

    if (user) {
      //Compare plain text password with hashed password in DB
      const authenticated = bcrypt.compareSync(credentials.pass, user.password);
      if (authenticated) {
        //Attach user to request object
        req.currentUser = user;
        return next();
      } else {
        message = 'Authentication failed';
      }
    } else {
      message = 'User not found';
    }
  } else {
    message = 'Auth header not found';
  }

  res.status(401).json({ message: 'Access Denied' });
};