import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './LandingPage.css';
import image1 from '../assets/images/1.png';
import image2 from '../assets/images/2.png';
import image3 from '../assets/images/3.png';
import Navbar from '../components/Navbar'; // Import the existing NavBar component

const LandingPage = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="landing-page">
      <Navbar showSearch={false} showLogout={false} /> {/* Pass prop to hide search bar */}


      <section className="features">
        <h1>Transform academics<br />  with AI-powered<br />  Noted AF.</h1>

        <p>Discover the ultimate AI-powered platform for creating and managing academic forms. <br />
          Explore our versatile solutions and services designed to enhance your academic experience.</p>
        <Link to="/signup" className="landing-btn">Sign Up for free</Link>
      </section>

      <header className="landing-header">
        <h1>Our Solutions</h1>
        <div className="features-container1">
          <div className="features-panels">
            <p>Seamless AI integration</p>
          </div>
          <div className="features-panels">
            <p>Secure OTP authentication</p>
          </div>
          <div className="features-panels">
            <p>Customized classroom environments</p>
          </div>
          </div>



          <div className="features-container2">
          <div className="features-panels">
            <p>AI-powered note summarization</p>
          </div>
          <div className="features-panels">
            <p>User-friendly interface</p>
          </div>
          <div className="features-panels">
            <p>Robust password protection</p>
          </div>
        </div>

        
      </header>


      {/* Image Slider */}
      <Slider {...sliderSettings} className="image-slider">
        <div>
          <img src={image1} alt="Slide 1" />
        </div>
        <div>
          <img src={image2} alt="Slide 2" />
        </div>
        <div>
          <img src={image3} alt="Slide 3" />
        </div>
        {/* Add more slides as needed */}
      </Slider>
      <section className="useralready">
        <h1>Already a user?</h1>
        <div className="landing-buttons">
          <Link to="/login" className="landing-btn">Login</Link>
        </div>
      </section>
   

      <section className="landing-info">
        <h2>About Noted AF</h2>
        <p>Noted AF is an academic platform built using the MERN stack (MongoDB, Express.js, React, Node.js) to allow teachers and students to create, view, and manage academic posts. It includes the functionality for students to join classrooms through email OTPs sent by teachers. The platform enables interaction and sharing of notes in the form of posts.</p>
      </section>

      <section className="landing-features">
        <h2>Features</h2>
        <ul>
          <li>Create and manage academic posts</li>
          <li>Join classrooms via email OTPs</li>
          <li>Share and interact with notes</li>
          <li>Real-time notifications</li>
          <li>Secure and reliable platform</li>
        </ul>
      </section>
    </div>
  );
};

export default LandingPage;