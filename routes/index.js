const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');
const Story = require('../models/Stories');

router.get('/', ensureGuest, (req, res) => {
  res.render('index/welcome');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  console.log(req.user.id);
  Story.find({ user: req.user.id })
    .populate('user')
    .then((story) => {
      res.render('index/dashboard', { story: story });
      console.log(story);
    })
    .catch((err) => console.log(err));
});

router.get('/about', (req, res) => {
  res.render('index/about');
});

module.exports = router;
