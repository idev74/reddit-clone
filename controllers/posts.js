const Post = require('../models/post');

module.exports = (app) => {
  app.get('/', async (req, res) => {
    try {
      const posts = await Post.find({}).lean();
      return res.render('posts-index', { posts });
    } catch (err) {
      console.log(err.message);
    }
  });

  app.get('/posts/new', (req, res) => {
    res.render('posts-new');
  });

  app.post('/posts/new', async (req, res) => {
    const post = new Post(req.body);
    
    try {
      await post.save();
      res.redirect('/');
    } catch (err) {
      console.log(err);
    }
  });

  app.get('/posts/:id', async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).lean().populate('comments')
      .then((post) => res.render('posts-show', { post }))
    } catch (err) {
      console.log(err.message);
    }
  });

  app.get('/n/:subreddit', async (req, res) => {
    try {
      const posts = await Post.find({ subreddit: req.params.subreddit }).lean();
      res.render('posts-index', { posts });
    } catch (err) {
      console.log(err.message);
    }
  });

};