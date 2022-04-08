const router = require('express').Router();
const { Post } = require('../../models/');
const withAuth = require('../../utils/auth');

// post method to allow user to add data
router.post('/', withAuth, async (req, res) => {
  // creates variable for req.body
  const body = req.body;
  // create method adding a new post to the Post model
  try {
    const newPost = await Post.create({
      ...req.body,
      // allows logged in user to post
      user_id: req.session.user_id
    });
    res.json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// with PUT request with a single id 
router.put('/:id', withAuth, async (req, res) => {
  try {
    const [affectedRows] = await Post.update(req.body, {
      // setting a parameter to set where to update post and only when user is logged in 
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      }
    });

    if (affectedRows > 0) {
      res.status(200).end();
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE request for a single ID
router.delete('/:id', withAuth, async (req, res) => {
  try {
    // with destroy method, the post from the Post table is deleted
    const [affectedRows] = Post.destroy({
      // setting a parameter to set where to destroy post and only when user is logged in 
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      }
    });

    if (affectedRows > 0) {
      res.status(200).end();
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
