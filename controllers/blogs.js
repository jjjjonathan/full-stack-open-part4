const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const body = request.body;

  const user = await User.findOne({});

  if (body.url === undefined || body.title === undefined) {
    response.status(400).end();
  } else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id,
    });

    const savedBlog = await blog.save();
    user.blogs = [...user.blogs, savedBlog._id];
    await user.save();
    response.status(201).json(savedBlog);
  }
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body;

  const updated = await Blog.findByIdAndUpdate(request.params.id, body, {
    new: true,
  });
  response.json(updated);
});

module.exports = blogsRouter;
