const router = require('express').Router();
const { User } = require('../../models');

// URL: /api/user
router.post('/', async (req, res) => {
  try {
    // creates a new user and adds it to the User model data
    const newUser = await User.create({
      // setting username to make a new user 
      username: req.body.username,
      // setting password to make a new user 
      password: req.body.password,
    });

    // in session
    // { "userId":"1"}
    req.session.save(() => {
      // sets user id in request session from the database
      req.session.userId = newUser.id
      // sets user id in request session from the database
      req.session.username = newUser.username
      // sets user id loggin in to true, to log them in
      req.session.loggedIn = true
      res.json(newUser);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


// URL: /api/user/login
router.post('/login', async (req, res) => {
  try {
    // finding a user from the User model
    const user = await User.findOne({
      // finds the username of the user trying to login from the data 
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      res.status(400).json({ message: 'No user account found!' });
      return;
    }

    const validPassword = user.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'No user account found!' });
      return;
    }

    req.session.save(() => {
      // retrieves user id in request session and saves to the database
      req.session.userId = user.id
      // retrieves username in request session and saves to the database
      req.session.username = user.username
      // once user id and username are both retrieved login is set to true
      req.session.loggedIn = true
      res.json({ user, message: 'You are now logged in!' });
    });
  } catch (err) {
    res.status(400).json({ message: 'No user account found!' });
  }
});

router.post('/logout', (req, res) => {
  // checks to see if user is logged in
  if (req.session.loggedIn) {
    // if logged in, session is destroyed
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
