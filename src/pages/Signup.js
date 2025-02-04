import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Signup.css';
import { toast } from 'react-toastify';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false); // For form submission
    const [otpLoading, setOtpLoading] = useState(false); // For OTP button loading

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !password || !otp) {
            toast.error('All fields are required!');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, otp, role }),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Registration successful!');
                login({ email, role });
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
        if (!email) {
            toast.error('Please enter your email.');
            return;
        }

        setOtpLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/sendotp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('OTP sent successfully. Check your email!');
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
                <h2>Noted AF</h2>
                <p>Please enter your details to continue.</p>

                <form onSubmit={handleSubmit} className='signup-form'>
                    <div className="input-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div className="send-otp-btn-container">

                            <button
                                type="button"
                                onClick={handleSendOtp}
                                className="send-otp-btn"
                                disabled={otpLoading}
                            >
                                {otpLoading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </div>
                        <div className="input-group">

                            <div className="input-group">
                                <label htmlFor="otp">OTP</label>
                                <input
                                    type="text"
                                    id="otp"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />

                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                                <label htmlFor="role">Role</label>
                                <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                                    <option value="teacher">Teacher</option>
                                    <option value="student">Student</option>
                                </select>
                            </div>
                            <button type="submit" disabled={loading}>
                                {loading ? 'Registering...' : 'Signup'}
                            </button>
                        </div>
                    </div>
                </form>

                <div className="login-link">
                    <p>
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </div>
            </div>

            <div className='login-right'>
            <h1>Elevate your education<br />  with AI-enhanced<br />  Noted AF.</h1>
          <div className='login-bottom'>
          <p>Discover the ultimate AI-powered platform for creating and managing academic forms. <br />
          Explore our versatile solutions and services designed to enhance your academic experience.</p>
          </div>

          </div>
          



        </div>
    );
};

export default Signup;
