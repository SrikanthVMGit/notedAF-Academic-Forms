const express = require('express');
const router = express.Router();

router.post('/generate', (req, res) => {
    const { subject, numberOfQuestions } = req.body;

    // Mock quiz generation logic
    const quiz = [];
    for (let i = 0; i < numberOfQuestions; i++) {
        quiz.push({
            question: `Sample question ${i + 1} on ${subject}`,
            options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        });
    }

    res.json({ quiz });
});

module.exports = router;