const express = require('express');
const hbs = require('express-handlebars');
const app = express();

app.engine('handlebars', hbs.engine({ defaultLayout: 'main', partialsDir: __dirname + '/views/partials'}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'handlebars');
app.set('views', './views');

require('./controllers/posts')(app);
require('./controllers/comments')(app);
require('./data/reddit-db');

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/posts/new', (req, res) => {
    res.render('posts-new');
});

app.listen(3000);

module.exports = app;