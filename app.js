const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const posts = require('./controllers/posts')(app);
const db = require('./data/reddit-db');

   

const hbs = handlebars.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        foo() { return 'FOO!'; },
        bar() { return 'BAR!'; }
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/posts/new', (req, res) => {
    res.render('posts-new');
});

app.listen(3000);