import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Email Validation Function
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      toast.error('Email and Password are required!');
      return;
    }
  
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address!');
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success('Logged in successfully');
        login(data.data);
        navigate('/'); // Redirect to homepage after login
      } else {
        toast.error(data.message || 'Invalid email or password');
      }
    } catch (error) {
      toast.error('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-page">
      
      <div className="login-container">
        <h2>Noted Academic Forms</h2>
        <p>Please enter your details to continue.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <FaSpinner className="spinner" /> Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="signup-link">
          <p>
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </div>
      </div>

          <div className='login-right'>
          <h1>Enhance your learning<br />  with AI-driven<br />  Noted AF.</h1>

          <div className='login-bottom'>
          <p>Discover the ultimate AI-powered platform for creating and managing academic forms. <br />
          Explore our versatile solutions and services designed to enhance your academic experience.</p>
          </div>

          </div>
          

    </div>
  );
};

export default Login;