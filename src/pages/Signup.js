import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import './Signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        otp: '',
        role: 'student'
    });
    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleInputChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.password || !formData.otp) {
            toast.error('All fields are required!');
            return;
        }

        if (!isValidEmail(formData.email)) {
            toast.error('Please enter a valid email address!');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password should be at least 6 characters long!');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('🎉 Welcome to NotedAF! Registration successful!');
                login(data.data);
                navigate('/');
            } else {
                toast.error(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            toast.error('An error occurred during registration.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async () => {
        if (!formData.email) {
            toast.error('Please enter your email.');
            return;
        }

        if (!isValidEmail(formData.email)) {
            toast.error('Please enter a valid email address!');
            return;
        }

        setOtpLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/sendotp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email }),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('📧 OTP sent successfully! Check your email.');
                setOtpSent(true);
            } else {
                toast.error(data.message || 'Failed to send OTP.');
            }
        } catch (error) {
            toast.error('An error occurred while sending OTP.');
        } finally {
            setOtpLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <Card className="signup-card">
                    <Card.Header>
                        <div className="signup-header">
                            <h1 className="signup-title">Join NotedAF</h1>
                            <p className="signup-subtitle">
                                Create your account to start your learning journey
                            </p>
                        </div>
                    </Card.Header>
                    
                    <Card.Body>
                        <form onSubmit={handleSubmit} className="signup-form">
                            <Input
                                label="Full Name"
                                type="text"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleInputChange('name')}
                                required
                                icon={<UserIcon />}
                            />

                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleInputChange('email')}
                                required
                                icon={<EmailIcon />}
                            />

                            <div className="otp-section">
                                <div className="otp-input-group">
                                    <Input
                                        label="Email Verification Code"
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        value={formData.otp}
                                        onChange={handleInputChange('otp')}
                                        required
                                        icon={<ShieldIcon />}
                                        helperText={otpSent ? "OTP sent to your email" : "Click 'Send OTP' to receive verification code"}
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={handleSendOtp}
                                        loading={otpLoading}
                                        disabled={!formData.email || !isValidEmail(formData.email)}
                                        className="send-otp-btn"
                                    >
                                        {otpSent ? 'Resend OTP' : 'Send OTP'}
                                    </Button>
                                </div>
                            </div>

                            <Input
                                label="Password"
                                type="password"
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={handleInputChange('password')}
                                required
                                icon={<LockIcon />}
                                helperText="Minimum 6 characters required"
                            />

                            <div className="role-selection">
                                <label className="input-label">I am a</label>
                                <div className="role-options">
                                    <label className={`role-option ${formData.role === 'student' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="student"
                                            checked={formData.role === 'student'}
                                            onChange={handleInputChange('role')}
                                        />
                                        <div className="role-card">
                                            <StudentIcon />
                                            <span>Student</span>
                                        </div>
                                    </label>
                                    <label className={`role-option ${formData.role === 'teacher' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="teacher"
                                            checked={formData.role === 'teacher'}
                                            onChange={handleInputChange('role')}
                                        />
                                        <div className="role-card">
                                            <TeacherIcon />
                                            <span>Teacher</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                loading={loading}
                                className="signup-submit-btn"
                            >
                                Create Account
                            </Button>
                        </form>
                    </Card.Body>

                    <Card.Footer>
                        <p className="login-link">
                            Already have an account?{' '}
                            <Link to="/login" className="link-primary">
                                Sign in here
                            </Link>
                        </p>
                    </Card.Footer>
                </Card>
            </div>

            <div className="signup-hero">
                <div className="hero-content">
                    <h2 className="hero-title">
                        Elevate your education with 
                        <span className="gradient-text"> AI-enhanced NotedAF</span>
                    </h2>
                    <p className="hero-description">
                        Discover the ultimate AI-powered platform for creating and managing 
                        academic content. Join thousands of students and teachers already 
                        transforming their learning experience.
                    </p>
                    <div className="hero-features">
                        <div className="feature">
                            <CheckIcon />
                            <span>AI-powered content creation</span>
                        </div>
                        <div className="feature">
                            <CheckIcon />
                            <span>Interactive quiz generation</span>
                        </div>
                        <div className="feature">
                            <CheckIcon />
                            <span>Smart content summarization</span>
                        </div>
                        <div className="feature">
                            <CheckIcon />
                            <span>Collaborative learning tools</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Icon Components
const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const EmailIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const LockIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <circle cx="12" cy="16" r="1" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const ShieldIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const StudentIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
);

const TeacherIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20,6 9,17 4,12" />
    </svg>
);

export default Signup;
