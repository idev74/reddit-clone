const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = (app) => {
    app.get('/sign-up', (req, res) => res.render('sign-up'));

    app.post('/sign-up', async (req, res) => {
        try {
            const user = new User(req.body);
            await user.save();
            const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '60 days' });
            res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
            return res.redirect('/');
        } catch (err) {
            console.log(err.message);
            return res.status(400).send({ err });
        }
    });

    app.get('/logout', (req, res) => {
        res.clearCookie('nToken');
        return res.redirect('/');
    });
};