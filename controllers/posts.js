const Post = require('../models/post');
const User = require('../models/user');

module.exports = (app) => {
  app.get('/', async (req, res) => {
    try {
      const posts = await Post.find({}).lean().populate('author');
      const currentUser = req.user;
      return res.render('posts-index', { posts, currentUser });
    } catch (err) {
      console.log(err.message);
    }
  });

  app.get('/posts/new', (req, res) => {
    res.render('posts-new');
  });

  app.post('/posts/new', async (req, res) => {
    if (req.user) {
      const userId = req.user._id;
      const post = new Post(req.body);
      post.author = userId;
  
      try {
        await post.save();
        const user = await User.findById(userId);
        user.posts.unshift(post);
        await user.save();
        return res.redirect(`/posts/${post._id}`);
      } catch (err) {
        console.log(err.message);
      }
    } else {
      return res.status(401); 
    }
  });

  app.get('/posts/:id', async (req, res) => {
    const currentUser = req.user;
  
    try {
      const post = await Post.findById(req.params.id).populate('comments').lean();
      return res.render('posts-show', { post, currentUser });
    } catch (err) {
      console.log(err.message);
    }
  });
  
  app.get('/n/:subreddit', (req, res) => {
    const currentUser = req.user;
    const { subreddit } = req.params;
    Post.find({ subreddit }).lean().populate('author')
      .then((posts) => res.render('posts-index', { posts, currentUser }))
      .catch((err) => {
        console.log(err);
      });
  });

  app.get('/', (req, res) => {
    const currentUser = req.user;

    Post.find({})
      .then((posts) => res.render('posts-index', { posts, currentUser }))
      .catch((err) => {
        console.log(err.message);
      });
  });

};