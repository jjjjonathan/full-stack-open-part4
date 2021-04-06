const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (request, response) => {
  const { name, username, password } = request.body;

  const salt = 11;
  const passwordHash = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    username,
    passwordHash,
  });

  const savedUser = await user.save();

  response.json(savedUser);
});

module.exports = usersRouter;
