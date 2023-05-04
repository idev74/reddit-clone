const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, before, after } = require('mocha');
chai.use(chaiHttp);
const app = require('../server');
const agent = chai.request.agent(app);


const User = require('../models/user');
const Post = require('../models/post');

const should = chai.should();


describe('Posts', () => {
    
    const newPost = {
        title: 'post title',
        url: 'https://www.google.com',
        summary: 'post summary',
        subreddit: 'test',
    };
    
    const user = {
        username: 'poststest',
        password: 'testposts',
    };
    
    after(function (done) {
        Post.findOneAndDelete(newPost)
        .then(function () {
          agent.close();
      
          User
            .findOneAndDelete({
              username: user.username,
            })
            .then(function () {
              done();
            })
            .catch(function (err) {
              done(err);
            });
        })
        .catch(function (err) {
          done(err);
        });
      });
    
    before(function (done) {
        agent
          .post('/sign-up')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send(user)
          .then(function (res) {
            done();
          })
          .catch(function (err) {
            done(err);
          });
      });

    it('should create with valid attributes at POST /posts/new', (done) => {
        Post.estimatedDocumentCount()
            .then((initialDocCount) => {
                agent
                    .post('/posts/new')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send(newPost)
                    .then((res) => {
                        Post.estimatedDocumentCount()
                            .then((newDocCount) => {
                                res.should.have.status(200);
                                newDocCount.should.equal(initialDocCount + 1)
                                done();
                            })
                            .catch((err) => {
                                done(err);
                            });
                    })
                    .catch((err) => {
                        done(err);
                    });
            })
            .catch((err) => {
                done(err);
            });
    });
});