import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Welcome to Noted AF</h1>
        <p>Your academic platform for managing classrooms and posts.</p>
        <div className="landing-buttons">
          <Link to="/login" className="landing-btn">Login</Link>
          <Link to="/signup" className="landing-btn">Sign Up</Link>
        </div>
      </header>
      <section className="landing-info">
        <h2>About Noted AF</h2>
        <p>Noted AF is an academic platform built using the MERN stack (MongoDB, Express.js, React, Node.js) to allow teachers and students to create, view, and manage academic posts. It includes the functionality for students to join classrooms through email OTPs sent by teachers. The platform enables interaction and sharing of notes in the form of posts.</p>
      </section>
    </div>
  );
};

export default LandingPage;