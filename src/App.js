import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage'; // Import the new Quiz Page
import { AuthProvider, useAuth } from './context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfilePage from './pages/ProfilePage';
import ClassesDetails from './pages/ClassesDetails';
import LandingPage from './pages/LandingPage'; // Import the new landing page

const ProtectedRoute = ({ children }) => {
  const { auth, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/checklogin`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();

        if (response.ok && data.ok) {
          login({ userId: data.userId });
        } else {
          toast.error(data.message || 'Session expired. Please log in again.');
          navigate('/login');
        }
      } catch (error) {
        toast.error('Error checking login status.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, [navigate, login]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return auth.user ? children : <Navigate to="/login" />;
};

const App = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isLandingPage = location.pathname === '/';

  return (
    <AuthProvider>
      {!isAuthPage && !isLandingPage && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Add the landing page route */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/classes/:classid" element={<ProtectedRoute><ClassesDetails /></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} /> {/* New Quiz Page Route */}

      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable />
    </AuthProvider>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;