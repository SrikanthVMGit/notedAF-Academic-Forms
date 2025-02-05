import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Slider from 'react-slick';
import './HomePage.css';
import image1 from '../assets/images/1.png';
import image2 from '../assets/images/2.png';
import image3 from '../assets/images/3.png';


const Homepage = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Fetch user data on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/getuser`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok) {
                    setUser(data.data);
                }
            } catch (error) {
                toast.error('Failed to fetch user data');
            }
        };
        fetchUser();
    }, []);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
    };

    return (
        <div className="homepage">
            

            {/* Hero Section */}
            <section className="hero-section">
                <h1>Welcome to Noted AF <br></br>(academic forms)<br/></h1>
                <h2>
                <br/>"The journey of a thousand miles<br/> begins with a single step."</h2>
                <p>
                    {user
                        ? `Hello, ${user.name}! Ready to explore your classrooms?`
                        : 'Join or create classrooms to enhance your learning experience!'}
                </p>
                
                <button
                    className="explore-btn"
                    onClick={() => navigate(user ? '/profile' : '/signup')}
                >
                    {user ? (user.role === 'teacher' ? 'Go to Your Classes' : 'Go to Learning Dashboard') : 'Get Started'}
                </button>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2>Experience the best features of<br/> Noted AF<p>Noted AF is designed to streamline your academic workflow.<br/> Discover powerful tools and features to enhance your learning experience.</p></h2>
              
                <div className="features-grid">
                    <div className="feature-card">
                        <img src="https://img.icons8.com/ios/100/000000/teacher.png" alt="Create Classrooms" />
                        <h3>Create Classrooms</h3>
                        <p>Teachers can easily create and manage virtual classrooms.</p>
                    </div>
                    <div className="feature-card">
                        <img src="https://img.icons8.com/ios/100/000000/classroom.png" alt="Join Classes" />
                        <h3>Join Classes</h3>
                        <p>Students can join classrooms and stay engaged with learning.</p>
                    </div>
                    <div className="feature-card">
                        <img src="https://img.icons8.com/ios/100/000000/online-support.png" alt="Interactive Learning" />
                        <h3>AI Integrated</h3>
                        <p>Use AI to Summarize your notes and make learning simple.</p>
                    </div>
                </div>
            </section>

            {/* Role-based CTA */}
            {user && user.role === 'teacher' && (
                <section className="cta-section">
                    <h2>Start Teaching Today</h2>
                    <p>Create your first classroom and start sharing knowledge!</p>
                    <button onClick={() => navigate('/profile')} className="cta-btn">Create Classroom</button>
                </section>
            )}

            {user && user.role === 'student' && (
                <section className="cta-section">
                    <h2>Explore New Classrooms</h2>
                    <p>Join classes and enhance your learning experience.</p>
                    <button onClick={() => navigate('/profile')} className="cta-btn">Join Classroom</button>
                </section>
            )}
        </div>
    );
};

export default Homepage;