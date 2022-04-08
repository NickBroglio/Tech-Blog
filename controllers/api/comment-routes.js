const router = require('express').Router();
const { Comment } = require('../../models/');
const withAuth = require('../../utils/auth');

// URL: /api/comment
router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      // Creates comments and adds them to the body
      ...req.body,
      // user_id logged in to create comment
      user_id: req.session.user_id
    });
    res.json(newComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;



