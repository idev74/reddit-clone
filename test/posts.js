const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
chai.use(chaiHttp);
const app = require('../server');
const agent = chai.request.agent(app);

const Post = require('../models/post');

const should = chai.should();

describe('Posts', () => {
    const newPost = {
        title: 'post title',
        url: 'https://www.google.com',
        summary: 'post summary'
    };
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
    after(() => {
        Post.findOneAndDelete(newPost);
    });
});