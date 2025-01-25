import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './LandingPage.css';
import image1 from '../assets/images/1.png';
import image2 from '../assets/images/2.png';
import image3 from '../assets/images/3.png';
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
      <header className="landing-header">
        <h1>Welcome to Noted AF</h1>
        <p>Your academic platform for managing classrooms and posts.</p>
       
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

      <div className="landing-buttons">
          <Link to="/login" className="landing-btn">Login</Link>
          <Link to="/signup" className="landing-btn">Sign Up</Link>
        </div>
        
      <section className="landing-info">
        <h2>About Noted AF</h2>
        <p>Noted AF is an academic platform built using the MERN stack (MongoDB, Express.js, React, Node.js) to allow teachers and students to create, view, and manage academic posts. It includes the functionality for students to join classrooms through email OTPs sent by teachers. The platform enables interaction and sharing of notes in the form of posts.</p>
      </section>
     
    </div>
  );
};

export default LandingPage;