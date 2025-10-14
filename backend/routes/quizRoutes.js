const express = require('express');
const router = express.Router();

// Quiz templates for different subjects and difficulty levels
const quizTemplates = {
    javascript: {
        easy: [
            {
                question: "What does 'var' keyword do in JavaScript?",
                options: ["Declares a variable", "Creates a function", "Defines a class", "Imports a module"],
                correctAnswer: "Declares a variable",
                explanation: "The 'var' keyword is used to declare variables in JavaScript."
            },
            {
                question: "Which of the following is NOT a JavaScript data type?",
                options: ["String", "Boolean", "Integer", "Object"],
                correctAnswer: "Integer",
                explanation: "JavaScript uses 'number' for all numeric values, not separate integer and float types."
            },
            {
                question: "How do you write 'Hello World' in an alert box?",
                options: ["alert('Hello World');", "msg('Hello World');", "alertBox('Hello World');", "msgBox('Hello World');"],
                correctAnswer: "alert('Hello World');",
                explanation: "The alert() function displays an alert dialog with the specified message."
            }
        ],
        medium: [
            {
                question: "What is the difference between '==' and '===' in JavaScript?",
                options: ["No difference", "'==' checks type and value, '===' checks only value", "'==' checks only value, '===' checks type and value", "Both are deprecated"],
                correctAnswer: "'==' checks only value, '===' checks type and value",
                explanation: "'==' performs type coercion before comparison, while '===' checks both type and value strictly."
            },
            {
                question: "Which method is used to add an element to the end of an array?",
                options: ["push()", "pop()", "shift()", "unshift()"],
                correctAnswer: "push()",
                explanation: "The push() method adds one or more elements to the end of an array."
            }
        ],
        hard: [
            {
                question: "What is a closure in JavaScript?",
                options: ["A way to close browser windows", "A function with access to outer function's variables", "A method to terminate loops", "A type of error handling"],
                correctAnswer: "A function with access to outer function's variables",
                explanation: "A closure gives you access to an outer function's scope from an inner function."
            }
        ]
    },
    history: {
        easy: [
            {
                question: "When did World War II end?",
                options: ["1943", "1944", "1945", "1946"],
                correctAnswer: "1945",
                explanation: "World War II ended in 1945 with the surrender of Japan in September."
            },
            {
                question: "Who was the first President of the United States?",
                options: ["Thomas Jefferson", "George Washington", "John Adams", "Benjamin Franklin"],
                correctAnswer: "George Washington",
                explanation: "George Washington served as the first President from 1789 to 1797."
            }
        ],
        medium: [
            {
                question: "The Renaissance period began in which country?",
                options: ["France", "Germany", "Italy", "England"],
                correctAnswer: "Italy",
                explanation: "The Renaissance began in Italy during the 14th century, particularly in Florence."
            }
        ]
    },
    biology: {
        easy: [
            {
                question: "What is the powerhouse of the cell?",
                options: ["Nucleus", "Mitochondria", "Ribosome", "Cytoplasm"],
                correctAnswer: "Mitochondria",
                explanation: "Mitochondria produce ATP, which provides energy for cellular processes."
            },
            {
                question: "How many chambers does a human heart have?",
                options: ["2", "3", "4", "5"],
                correctAnswer: "4",
                explanation: "The human heart has four chambers: two atria and two ventricles."
            }
        ],
        medium: [
            {
                question: "What is the process by which plants make their own food?",
                options: ["Respiration", "Photosynthesis", "Digestion", "Fermentation"],
                correctAnswer: "Photosynthesis",
                explanation: "Photosynthesis is the process where plants convert light energy into chemical energy."
            }
        ]
    },
    mathematics: {
        easy: [
            {
                question: "What is 15 + 27?",
                options: ["40", "42", "41", "43"],
                correctAnswer: "42",
                explanation: "15 + 27 = 42"
            },
            {
                question: "What is the area of a rectangle with length 5 and width 3?",
                options: ["8", "15", "12", "10"],
                correctAnswer: "15",
                explanation: "Area of rectangle = length × width = 5 × 3 = 15"
            }
        ],
        medium: [
            {
                question: "What is the value of π (pi) approximately?",
                options: ["3.14", "2.71", "1.61", "4.20"],
                correctAnswer: "3.14",
                explanation: "π (pi) is approximately 3.14159, commonly rounded to 3.14."
            }
        ]
    },
    physics: {
        easy: [
            {
                question: "What is the speed of light in vacuum?",
                options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "200,000 km/s"],
                correctAnswer: "300,000 km/s",
                explanation: "The speed of light in vacuum is approximately 299,792,458 meters per second or about 300,000 km/s."
            }
        ]
    }
};

// AI-like question generation function
function generateQuizQuestions(subject, difficulty, numberOfQuestions, topicDetails) {
    const subjectKey = subject.toLowerCase();
    let availableQuestions = [];

    // Get questions from templates
    if (quizTemplates[subjectKey] && quizTemplates[subjectKey][difficulty]) {
        availableQuestions = [...quizTemplates[subjectKey][difficulty]];
    }

    // If we don't have enough questions, create generic ones or use from different difficulty
    if (availableQuestions.length < numberOfQuestions) {
        // Try to get questions from other difficulty levels
        if (quizTemplates[subjectKey]) {
            Object.keys(quizTemplates[subjectKey]).forEach(level => {
                if (level !== difficulty) {
                    availableQuestions.push(...quizTemplates[subjectKey][level]);
                }
            });
        }

        // If still not enough, generate dynamic questions
        while (availableQuestions.length < numberOfQuestions) {
            availableQuestions.push(generateDynamicQuestion(subject, difficulty, topicDetails, availableQuestions.length + 1));
        }
    }

    // Shuffle and select the required number of questions
    const shuffled = availableQuestions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, numberOfQuestions);
}

// Generate dynamic questions when templates aren't available
function generateDynamicQuestion(subject, difficulty, topicDetails, questionNumber) {
    const topics = topicDetails || `general ${subject}`;
    
    const questionTemplates = [
        {
            question: `What is a key concept in ${topics}?`,
            options: [`Advanced ${subject} principle`, `Basic ${subject} concept`, `Intermediate ${subject} theory`, `Expert ${subject} application`],
            correctAnswer: difficulty === 'easy' ? `Basic ${subject} concept` : 
                          difficulty === 'medium' ? `Intermediate ${subject} theory` : 
                          difficulty === 'hard' ? `Advanced ${subject} principle` : 
                          `Expert ${subject} application`,
            explanation: `This question tests your understanding of ${topics} at ${difficulty} level.`
        },
        {
            question: `Which statement is true about ${topics}?`,
            options: [
                `${subject} is primarily theoretical`,
                `${subject} has practical applications`,
                `${subject} is only for experts`,
                `${subject} is outdated`
            ],
            correctAnswer: `${subject} has practical applications`,
            explanation: `Most fields of study, including ${subject}, have both theoretical and practical aspects.`
        },
        {
            question: `What level of complexity is associated with ${difficulty} ${subject}?`,
            options: ["Beginner level", "Intermediate level", "Advanced level", "Expert level"],
            correctAnswer: difficulty === 'easy' ? "Beginner level" :
                          difficulty === 'medium' ? "Intermediate level" :
                          difficulty === 'hard' ? "Advanced level" : "Expert level",
            explanation: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} level questions test appropriate complexity for that skill level.`
        }
    ];

    const template = questionTemplates[questionNumber % questionTemplates.length];
    return template;
}

// Main quiz generation route
router.post('/generate', async (req, res) => {
    try {
        const { 
            subject, 
            numberOfQuestions = 5, 
            difficulty = 'medium', 
            topicDetails = '', 
            questionType = 'multiple-choice',
            aiPrompt 
        } = req.body;

        // Validation
        if (!subject || subject.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                message: 'Subject is required for quiz generation.' 
            });
        }

        if (numberOfQuestions < 1 || numberOfQuestions > 50) {
            return res.status(400).json({ 
                success: false, 
                message: 'Number of questions must be between 1 and 50.' 
            });
        }

        // Generate quiz questions
        const quiz = generateQuizQuestions(
            subject.trim(), 
            difficulty, 
            parseInt(numberOfQuestions), 
            topicDetails.trim()
        );

        // Add metadata to response
        const response = {
            success: true,
            quiz: quiz,
            metadata: {
                subject: subject.trim(),
                difficulty: difficulty,
                questionCount: quiz.length,
                topicDetails: topicDetails,
                generatedAt: new Date().toISOString(),
                timeLimit: quiz.length * 60 // 1 minute per question
            }
        };

        res.json(response);

    } catch (error) {
        console.error('Quiz generation error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred while generating the quiz. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Route to get available subjects
router.get('/subjects', (req, res) => {
    const subjects = Object.keys(quizTemplates).map(subject => ({
        key: subject,
        name: subject.charAt(0).toUpperCase() + subject.slice(1),
        questionCounts: Object.keys(quizTemplates[subject]).reduce((acc, difficulty) => {
            acc[difficulty] = quizTemplates[subject][difficulty].length;
            return acc;
        }, {})
    }));

    res.json({
        success: true,
        subjects: subjects,
        totalSubjects: subjects.length
    });
});

module.exports = router;