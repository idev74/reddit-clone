const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

module.exports = (app) => {
  app.post('/posts/:postId/comments', async (req, res) => {
    try {
      if (req.user) {
        const comment = await new Comment(req.body);
        comment.author = req.user._id;

        const savedComment = await comment.save();
        const post = await Post.findById(req.params.postId);
        post.comments.unshift(comment);

        const savedPost = await post.save();
        return res.redirect('/');
      } else {
        return res.status(401); // UNAUTHORIZED
      }
    } catch (err) {
      console.log(err);
    }
  });
};