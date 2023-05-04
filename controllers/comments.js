const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

module.exports = (app) => {
  app.post('/posts/:postId/comments', async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).send({ message: 'You are not logged in!' });
      }
      
      const comment = new Comment(req.body);
      comment.author = req.user._id;
      await comment.save();
  
      const post = await Post.findById(req.params.postId);
      post.comments.unshift(comment);
      await post.save();
  
      res.redirect(`/posts/${req.params.postId}`);
    } catch (err) {
      console.log(err);
    }
  });
};