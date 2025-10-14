import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import './QuizPage.css';

const QuizPage = () => {
    const [quizDetails, setQuizDetails] = useState({ 
        subject: '', 
        numberOfQuestions: 5,
        difficulty: 'medium',
        topicDetails: '',
        questionType: 'multiple-choice'
    });
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(null);
    const [quizStarted, setQuizStarted] = useState(false);

    // Timer effect
    useEffect(() => {
        if (timeLeft > 0 && quizStarted && !showResults) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && quizStarted) {
            handleSubmitQuiz();
        }
    }, [timeLeft, quizStarted, showResults]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setQuizDetails({ ...quizDetails, [name]: value });
    };

    const handleGenerateQuiz = async () => {
        if (!quizDetails.subject.trim()) {
            toast.error('Please enter a subject for the quiz.');
            return;
        }

        setLoading(true);
        try {
            // Enhanced payload with AI-specific parameters
            const payload = {
                ...quizDetails,
                aiPrompt: `Generate a ${quizDetails.difficulty} level quiz about ${quizDetails.subject}. ${quizDetails.topicDetails ? `Focus on: ${quizDetails.topicDetails}` : ''} Create ${quizDetails.numberOfQuestions} ${quizDetails.questionType} questions with clear, educational content.`
            };

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/quiz/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setQuiz(data.quiz);
                setTimeLeft(data.metadata?.timeLimit || data.quiz.length * 60); // Use provided time limit or default
                setUserAnswers({});
                setCurrentQuestion(0);
                setShowResults(false);
                setScore(0);
                toast.success(`🎯 Quiz generated successfully! ${data.quiz.length} questions on ${data.metadata?.subject}. Good luck!`);
            } else {
                toast.error(data.message || 'Failed to generate quiz. Please try again.');
            }
        } catch (error) {
            console.error('Quiz generation error:', error);
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                toast.error('❌ Connection error. Please check your internet connection and try again.');
            } else {
                toast.error('❌ Error generating quiz. Please try again in a moment.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStartQuiz = () => {
        setQuizStarted(true);
        setCurrentQuestion(0);
        toast.info('⏰ Quiz started! Timer is now running.');
    };

    const handleAnswerSelect = (questionIndex, selectedOption) => {
        setUserAnswers({
            ...userAnswers,
            [questionIndex]: selectedOption
        });
    };

    const handleNextQuestion = () => {
        if (currentQuestion < quiz.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmitQuiz = () => {
        let correctAnswers = 0;
        quiz.forEach((question, index) => {
            if (userAnswers[index] === question.correctAnswer) {
                correctAnswers++;
            }
        });
        
        setScore(correctAnswers);
        setShowResults(true);
        setQuizStarted(false);
        
        const percentage = (correctAnswers / quiz.length) * 100;
        if (percentage >= 80) {
            toast.success(`🎉 Excellent! You scored ${correctAnswers}/${quiz.length} (${percentage.toFixed(1)}%)`);
        } else if (percentage >= 60) {
            toast.success(`👍 Good job! You scored ${correctAnswers}/${quiz.length} (${percentage.toFixed(1)}%)`);
        } else {
            toast.info(`📚 Keep learning! You scored ${correctAnswers}/${quiz.length} (${percentage.toFixed(1)}%)`);
        }
    };

    const handleRetakeQuiz = () => {
        setQuiz(null);
        setQuizStarted(false);
        setShowResults(false);
        setUserAnswers({});
        setCurrentQuestion(0);
        setScore(0);
        setTimeLeft(null);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="quiz-page">
            <div className="quiz-container">
                <div className="quiz-header">
                    <h1>🤖 AI-Powered Quiz Generator</h1>
                    <p>Create personalized quizzes with artificial intelligence</p>
                </div>

                {!quiz ? (
                    <Card className="quiz-form-card">
                        <div className="quiz-form">
                            <h2>📝 Create Your Quiz</h2>
                            
                            <div className="form-grid">
                                <Input
                                    label="Subject / Topic"
                                    type="text"
                                    name="subject"
                                    placeholder="e.g., JavaScript, World History, Biology"
                                    value={quizDetails.subject}
                                    onChange={handleChange}
                                    required
                                />

                                <Input
                                    label="Topic Details (Optional)"
                                    type="text"
                                    name="topicDetails"
                                    placeholder="e.g., Functions and Arrays, Renaissance Period"
                                    value={quizDetails.topicDetails}
                                    onChange={handleChange}
                                />

                                <div className="form-row">
                                    <div className="select-group">
                                        <label>Number of Questions</label>
                                        <select
                                            name="numberOfQuestions"
                                            value={quizDetails.numberOfQuestions}
                                            onChange={handleChange}
                                            className="quiz-select"
                                        >
                                            <option value={3}>3 Questions</option>
                                            <option value={5}>5 Questions</option>
                                            <option value={10}>10 Questions</option>
                                            <option value={15}>15 Questions</option>
                                            <option value={20}>20 Questions</option>
                                        </select>
                                    </div>

                                    <div className="select-group">
                                        <label>Difficulty Level</label>
                                        <select
                                            name="difficulty"
                                            value={quizDetails.difficulty}
                                            onChange={handleChange}
                                            className="quiz-select"
                                        >
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                            <option value="expert">Expert</option>
                                        </select>
                                    </div>

                                    <div className="select-group">
                                        <label>Question Type</label>
                                        <select
                                            name="questionType"
                                            value={quizDetails.questionType}
                                            onChange={handleChange}
                                            className="quiz-select"
                                        >
                                            <option value="multiple-choice">Multiple Choice</option>
                                            <option value="true-false">True/False</option>
                                            <option value="mixed">Mixed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <Button 
                                onClick={handleGenerateQuiz} 
                                loading={loading}
                                disabled={!quizDetails.subject.trim()}
                                size="lg"
                                className="generate-quiz-btn"
                            >
                                {loading ? '🤖 AI is generating your quiz...' : '✨ Generate Quiz with AI'}
                            </Button>
                        </div>
                    </Card>
                ) : showResults ? (
                    <Card className="results-card">
                        <div className="quiz-results">
                            <h2>🎯 Quiz Results</h2>
                            <div className="score-display">
                                <div className="score-circle">
                                    <span className="score-number">{score}</span>
                                    <span className="score-total">/{quiz.length}</span>
                                </div>
                                <div className="score-percentage">
                                    {((score / quiz.length) * 100).toFixed(1)}%
                                </div>
                            </div>
                            
                            <div className="results-summary">
                                <h3>📊 Detailed Results</h3>
                                {quiz.map((question, index) => (
                                    <div key={index} className={`result-item ${userAnswers[index] === question.correctAnswer ? 'correct' : 'incorrect'}`}>
                                        <div className="question-result">
                                            <span className="question-number">Q{index + 1}</span>
                                            <div className="question-content">
                                                <p className="question-text">{question.question}</p>
                                                <div className="answer-comparison">
                                                    <div className="your-answer">
                                                        <strong>Your answer:</strong> {userAnswers[index] || 'Not answered'}
                                                    </div>
                                                    <div className="correct-answer">
                                                        <strong>Correct answer:</strong> {question.correctAnswer}
                                                    </div>
                                                    {question.explanation && (
                                                        <div className="explanation">
                                                            <strong>Explanation:</strong> {question.explanation}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="result-icon">
                                                {userAnswers[index] === question.correctAnswer ? '✅' : '❌'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="results-actions">
                                <Button onClick={handleRetakeQuiz} variant="primary" size="lg">
                                    🔄 Take Another Quiz
                                </Button>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="quiz-taking">
                        <div className="quiz-header-info">
                            <Card className="quiz-info-card">
                                <div className="quiz-progress">
                                    <div className="progress-info">
                                        <h2>{quizDetails.subject} Quiz</h2>
                                        <div className="quiz-meta">
                                            <span>Question {currentQuestion + 1} of {quiz.length}</span>
                                            <span>•</span>
                                            <span className="difficulty-badge">{quizDetails.difficulty}</span>
                                        </div>
                                    </div>
                                    {timeLeft !== null && (
                                        <div className={`timer ${timeLeft < 60 ? 'timer-warning' : ''}`}>
                                            ⏰ {formatTime(timeLeft)}
                                        </div>
                                    )}
                                </div>
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill" 
                                        style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
                                    ></div>
                                </div>
                            </Card>
                        </div>

                        {!quizStarted ? (
                            <Card className="quiz-start-card">
                                <div className="quiz-start">
                                    <h3>🚀 Ready to Start?</h3>
                                    <div className="quiz-overview">
                                        <div className="overview-item">
                                            <span className="overview-label">Questions:</span>
                                            <span>{quiz.length}</span>
                                        </div>
                                        <div className="overview-item">
                                            <span className="overview-label">Time Limit:</span>
                                            <span>{formatTime(timeLeft)}</span>
                                        </div>
                                        <div className="overview-item">
                                            <span className="overview-label">Difficulty:</span>
                                            <span>{quizDetails.difficulty}</span>
                                        </div>
                                    </div>
                                    <Button onClick={handleStartQuiz} size="lg" className="start-quiz-btn">
                                        ▶️ Start Quiz
                                    </Button>
                                </div>
                            </Card>
                        ) : (
                            <Card className="question-card">
                                <div className="quiz-question">
                                    <h3 className="question-text">
                                        {quiz[currentQuestion].question}
                                    </h3>
                                    
                                    <div className="question-options">
                                        {quiz[currentQuestion].options.map((option, optionIndex) => (
                                            <div 
                                                key={optionIndex} 
                                                className={`option ${userAnswers[currentQuestion] === option ? 'selected' : ''}`}
                                                onClick={() => handleAnswerSelect(currentQuestion, option)}
                                            >
                                                <div className="option-indicator">
                                                    {String.fromCharCode(65 + optionIndex)}
                                                </div>
                                                <span className="option-text">{option}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="question-navigation">
                                        <Button 
                                            onClick={handlePreviousQuestion}
                                            disabled={currentQuestion === 0}
                                            variant="secondary"
                                        >
                                            ← Previous
                                        </Button>
                                        
                                        <div className="nav-info">
                                            {currentQuestion + 1} / {quiz.length}
                                        </div>

                                        {currentQuestion === quiz.length - 1 ? (
                                            <Button 
                                                onClick={handleSubmitQuiz}
                                                variant="success"
                                                disabled={Object.keys(userAnswers).length !== quiz.length}
                                            >
                                                ✅ Submit Quiz
                                            </Button>
                                        ) : (
                                            <Button 
                                                onClick={handleNextQuestion}
                                                disabled={currentQuestion === quiz.length - 1}
                                            >
                                                Next →
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        )}

                        <Card className="quiz-sidebar">
                            <div className="answer-overview">
                                <h4>📋 Answer Overview</h4>
                                <div className="answer-grid">
                                    {quiz.map((_, index) => (
                                        <div 
                                            key={index}
                                            className={`answer-indicator ${userAnswers[index] ? 'answered' : 'unanswered'} ${index === currentQuestion ? 'current' : ''}`}
                                            onClick={() => setCurrentQuestion(index)}
                                        >
                                            {index + 1}
                                        </div>
                                    ))}
                                </div>
                                <div className="answered-count">
                                    {Object.keys(userAnswers).length} of {quiz.length} answered
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizPage;