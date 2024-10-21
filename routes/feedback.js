const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback'); // Assuming feedback model is in models folder
const flash = require('connect-flash');

// Display the feedback form
router.get('/feedback', (req, res) => {
    res.render('users/feedback.ejs', { messages: req.flash() }); // Pass flash messages to the template
});

// Handle feedback form submission
router.post('/feedback', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        // Validate form fields
        if (!name || !email || !message) {
            req.flash('error', 'All fields are required.');
            return res.redirect('/feedback');
        }

        // Create and save new feedback
        const newFeedback = new Feedback({ name, email, message });
        await newFeedback.save();

        req.flash('success', 'Thank you for your feedback!');
        res.redirect('/home'); // Redirect to home or another page
    } catch (error) {
        console.error('Error submitting feedback:', error);
        req.flash('error', 'An error occurred while submitting your feedback.');
        res.redirect('/feedback');
    }
});

module.exports = router;
