const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');
const Story = require('../models/Stories');

//Stories Index
router.get('/', (req, res) => {
  Story.find({ status: 'public' })
    .populate('user')
    .then((stories) => {
      res.render('stories/index', { stories: stories });
    })
    .catch((err) => console.log(err));
});

//Add Stories Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

//Add Stories
router.post('/', ensureAuthenticated, (req, res) => {
  let allowcomments;
  if (req.body.allowcomments) {
    allowcomments = true;
  } else {
    allowcomments = false;
  }

  const newStory = {
    title: req.body.title,
    status: req.body.status,
    allowcomments: req.body.allowcomments,
    body: req.body.body,
    user: req.user.id,
  };

  new Story(newStory)
    .save()
    .then((story) => res.redirect(`/stories/show/${story._id}`))
    .catch((err) => console.log(err));
});

//Show Story
router.get('/show/:id', (req, res) => {
  Story.findOne({ _id: req.params.id })
    .populate('user')
    .populate('comments.commentUser')
    .then((story) => {
      if (story.status == 'public') {
        res.render('stories/show', { story: story });
      } else {
        res.redirect('/stories');
      }
    })
    .catch((err) => console.log(err));
});
//Edit Stories
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Story.findById(req.params.id).then((story) => {
    res.render('stories/edit', { story: story });
  });
});

//Update Stories
router.put('/:id', (req, res) => {
  Story.findById(req.params.id).then((story) => {
    if (req.body.allowcomments) {
      allowcomments = true;
    } else {
      allowcomments = false;
    }
    story.title = req.body.title;
    story.status = req.body.status;
    story.allowcomments = allowcomments;
    story.body = req.body.body;

    story
      .save()
      .then((story) => res.redirect(`/dashboard`))
      .catch((err) => console.log(err));
  });
});

//Delete Stories
router.delete('/:id', (req, res) => {
  Story.findByIdAndRemove(req.params.id).then(() => res.redirect('/dashboard'));
});

//Show My Stories
router.get('/mystories', ensureAuthenticated, (req, res) => {
  Story.find({ user: req.user.id })
    .populate('user')
    .then((stories) => {
      res.render('stories/mystories', { stories: stories });
    });
});

//Show User Stories
router.get('/user/:id', (req, res) => {
  Story.find({ user: req.params.id, status: 'public' })
    .populate('user')
    .then((stories) => {
      res.render('stories/mystories', { stories: stories });
    });
});

// Add Comment
router.post('/:id/comments', (req, res) => {
  Story.findOne({
    _id: req.params.id,
  }).then((story) => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id,
    };

    // Add to comments array
    story.comments.unshift(newComment);

    story.save().then((story) => {
      res.redirect(`/stories/show/${story.id}`);
    });
  });
});

module.exports = router;
