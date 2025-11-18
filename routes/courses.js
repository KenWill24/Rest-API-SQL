// routes/courses.js
'use strict';

const express = require('express');
const router = express.Router();
const { Course, User } = require('../models');
const authenticateUser = require('../middleware/authenticateUser');

// GET /api/courses - all courses with user
router.get('/courses', async (req, res, next) => {
  try {
    const courses = await Course.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'emailAddress']
      }]
    });
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
});

// GET /api/courses/:id - single course with user
router.get('/courses/:id', async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'emailAddress']
      }]
    });

    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/courses - create new course
router.post('/courses', authenticateUser, async (req, res, next) => {
  try {
    const course = await Course.create({
      ...req.body,
      userId: req.currentUser.id
    });

    res.status(201).location(`/api/courses/${course.id}`).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      next(error);
    }
  }
});

// PUT /api/courses/:id - update course
router.put('/courses/:id', authenticateUser, async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (course) {
      if (course.userId === req.currentUser.id) {
        await course.update(req.body);
        res.status(204).end();
      } else {
        res.status(403).json({ message: 'Access denied' });
      }
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      next(error);
    }
  }
});

// DELETE /api/courses/:id - delete course
router.delete('/courses/:id', authenticateUser, async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (course) {
      if (course.userId === req.currentUser.id) {
        await course.destroy();
        res.status(204).end();
      } else {
        res.status(403).json({ message: 'Access denied' });
      }
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;