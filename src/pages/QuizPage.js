import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './QuizPage.css';

const QuizPage = () => {
    const [quizDetails, setQuizDetails] = useState({ subject: '', numberOfQuestions: 5 });
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setQuizDetails({ ...quizDetails, [name]: value });
    };

    const handleGenerateQuiz = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/quiz/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(quizDetails),
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                setQuiz(data.quiz);
                toast.success('Quiz generated successfully!');
            } else {
                toast.error(data.message || 'Failed to generate quiz.');
            }
        } catch (error) {
            toast.error('Error generating quiz.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="quiz-page">
            <h1>Take a Quiz</h1>
            {!quiz ? (
                <div className="quiz-form">
                    <input
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        value={quizDetails.subject}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="numberOfQuestions"
                        placeholder="Number of Questions"
                        value={quizDetails.numberOfQuestions}
                        onChange={handleChange}
                        min="1"
                    />
                    <button onClick={handleGenerateQuiz} disabled={loading}>
                        {loading ? 'Generating...' : 'Generate Quiz'}
                    </button>
                </div>
            ) : (
                <div className="quiz">
                    <h2>Quiz on {quizDetails.subject}</h2>
                    {quiz.map((question, index) => (
                        <div key={index} className="quiz-question">
                            <p>{index + 1}. {question.question}</p>
                            <ul>
                                {question.options.map((option, i) => (
                                    <li key={i}>{option}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuizPage;