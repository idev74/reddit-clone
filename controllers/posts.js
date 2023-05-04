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
    try {
      if (req.user) {
        const userId = req.user._id;
        const post = new Post(req.body);
        post.author = userId;
        post.upVotes = [];
        post.downVotes = [];
        post.voteScore = 0;

        await post.save();
        const user = await User.findById(userId);
        user.posts.unshift(post);
        await user.save();
        return res.redirect(`/posts/${post._id}`);
      } else {
        return res.status(401);
      }
    } catch (err) {
      console.log(err.message);
    }
  });

  app.get('/posts/:id', async (req, res) => {
    try {
      const currentUser = req.user;
      const post = await Post.findById(req.params.id).populate('comments').lean();
      res.render('posts-show', { post, currentUser });
    } catch (err) {
      console.log(err.message);
    }
  });

  app.get('/n/:subreddit', async (req, res) => {
    try {
      const { user } = req;
      const posts = await Post.find({ subreddit: req.params.subreddit }).lean();
      res.render('posts-index', { posts, user });
    } catch (err) {
      console.log(err);
    }
  });

  app.get('/', async (req, res) => {
    try {
      const currentUser = req.user;
      const posts = await Post.find({});
      res.render('posts-index', { posts, currentUser });
    } catch (err) {
      console.log(err.message);
    }
  });

  app.put('/posts/:id/vote-up', (req, res) => {
    Post.findById(req.params.id).then(post => {
      post.upVotes.push(req.user._id);
      post.voteScore += 1;
      post.save();

      return res.status(200);
    }).catch(err => {
      console.log(err);
    })
  });

  app.put('/posts/:id/vote-down', (req, res) => {
    Post.findById(req.params.id).then(post => {
      post.downVotes.push(req.user._id);
      post.voteScore -= 1;
      post.save();

      return res.status(200);
    }).catch(err => {
      console.log(err);
    });
  });

};