const Post = require('../models/post');

module.exports = (app) => {
    app.post('/posts/new', (req, res) => {
      const post = new Post(req.body);

      post.save(() => res.redirect('/'));
    });
  };