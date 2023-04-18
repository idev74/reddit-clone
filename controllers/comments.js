const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports = (app) => {
    app.post('/posts/:postId/comments', async (req, res) => {
      try {
        const comment = await new Comment(req.body);
        const savedComment = await comment.save();
        const post = await Post.findById(req.params.postId);
        post.comments.unshift(comment);
        const savedPost = await post.save();
        return res.redirect('/');
      } catch(err) {
        console.log(err);
      }
    });
  };