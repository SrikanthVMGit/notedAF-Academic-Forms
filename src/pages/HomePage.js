import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Slider from 'react-slick';
import './HomePage.css';

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
            {/* Image Slider */}
            <Slider {...sliderSettings} className="image-slider">
                <div>
                    <img src="path/to/your/image1.jpg" alt="Slide 1" />
                </div>
                <div>
                    <img src="path/to/your/image2.jpg" alt="Slide 2" />
                </div>
                <div>
                    <img src="path/to/your/image3.jpg" alt="Slide 3" />
                </div>
                {/* Add more slides as needed */}
            </Slider>

            {/* Hero Section */}
            <section className="hero-section">
                <h1>Welcome to Noted AF <br></br>(academic forms)</h1>
                <p>
                    {user
                        ? `Hello, ${user.name}! Ready to explore your classrooms?`
                        : 'Join or create classrooms to enhance your learning experience!'}
                </p>
                <button
                    className="explore-btn"
                    onClick={() => navigate(user ? '/profile' : '/signup')}
                >
                    {user ? (user.role === 'teacher' ? 'Your Classes' : 'Learning Dashboard') : 'Get Started'}
                </button>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2>Experience the best features of the Forms</h2>
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
                        <h3>Interactive Learning</h3>
                        <p>Collaborate and interact with peers and teachers in real-time.</p>
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