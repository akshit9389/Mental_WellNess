const express = require('express');
const router = express.Router();
const User=require('../models/user.js');
const passport = require("passport");

router.get('/signup', (req, res) => { 
    res.render('users/login.ejs');
});
router.post('/signup', async (req, res) => {
    console.log('Request Body:', req.body); // Log the entire request body

    let { username, password, email, role } = req.body; // Include role from the form

    if (!username || !password || !email || !role) { // Validate role
        return res.status(400).send("All fields, including role, are required.");
    }

    const newUser = new User({ username, email, role }); // Add role to the new user
    try {
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash('success', 'User registered successfully. Please log in.');
        res.redirect('/login');
    } catch (error) {
        console.error("Error during registration:", error); // Log the error
        res.status(500).send("Error registering user: " + error.message);
    }
});


router.get('/login', (req, res) => { 
    res.render('users/login.ejs');
});
router.post('/login', passport.authenticate('local', {
    failureFlash: true,    // Show flash message on failure
    failureRedirect: '/login', 
}), (req, res) => {
    req.flash('success', 'Welcome back, ' + req.user.username + '!');
    if (req.user.role === 'doctor') {
        res.redirect('/listings/new');
    }
    else {
        res.redirect('/home');
    }
});


module.exports = router;