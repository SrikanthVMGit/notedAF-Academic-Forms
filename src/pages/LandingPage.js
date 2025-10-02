import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  const featuresRef = useRef(null);
  const solutionsRef = useRef(null);
  const aboutRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, observerOptions);

    [featuresRef.current, solutionsRef.current, aboutRef.current].forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      <Navbar showSearch={false} showLogout={false} />

      {/* Hero Section */}
      <section className="hero-section hero-gradient">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title gradient-text">
                Transform Academics<br />
                with <span className="text-premium">AI-Powered</span><br />
                NotedAF
              </h1>
              <p className="hero-description">
                Discover the ultimate AI-powered platform for creating and managing 
                academic forms. Explore our versatile solutions and services designed 
                to enhance your academic experience with cutting-edge technology.
              </p>
              <div className="hero-actions">
                <Link to="/signup" className="btn-primary btn-gradient hover-lift">
                  <span>Start Your Journey</span>
                  <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link to="/login" className="btn-secondary btn-glass hover-lift">
                  Already a Member?
                </Link>
              </div>
            </div>
            <div className="hero-visual">
              <div className="floating-cards">
                <div className="floating-card card-premium floating">
                  <div className="card-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3>AI Intelligence</h3>
                  <p>Smart automation</p>
                </div>
                <div className="floating-card card-premium floating" style={{animationDelay: '1s'}}>
                  <div className="card-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3>Secure Platform</h3>
                  <p>Enterprise security</p>
                </div>
                <div className="floating-card card-premium floating" style={{animationDelay: '2s'}}>
                  <div className="card-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3>Collaborative</h3>
                  <p>Team workflows</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section ref={solutionsRef} className="solutions-section section-padding">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title gradient-text">Innovative Solutions</h2>
            <p className="section-description">
              Discover powerful features designed to revolutionize your academic workflow
            </p>
          </div>
          
          <div className="solutions-grid">
            <div className="solution-card card-premium hover-lift">
              <div className="solution-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3>Seamless AI Integration</h3>
              <p>Advanced AI algorithms that understand and adapt to your academic needs, providing intelligent assistance every step of the way.</p>
              <div className="solution-badge">
                <span>Smart</span>
              </div>
            </div>

            <div className="solution-card card-premium hover-lift">
              <div className="solution-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3>Secure OTP Authentication</h3>
              <p>Military-grade security with multi-factor authentication ensuring your academic data remains protected and accessible only to authorized users.</p>
              <div className="solution-badge">
                <span>Secure</span>
              </div>
            </div>

            <div className="solution-card card-premium hover-lift">
              <div className="solution-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3>Customized Classroom Environments</h3>
              <p>Create and manage personalized learning spaces that adapt to your teaching style and student needs with intuitive design tools.</p>
              <div className="solution-badge">
                <span>Flexible</span>
              </div>
            </div>

            <div className="solution-card card-premium hover-lift">
              <div className="solution-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3>AI-Powered Note Summarization</h3>
              <p>Transform lengthy academic content into concise, meaningful summaries that capture key concepts and enhance learning efficiency.</p>
              <div className="solution-badge">
                <span>Intelligent</span>
              </div>
            </div>

            <div className="solution-card card-premium hover-lift">
              <div className="solution-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3>User-Friendly Interface</h3>
              <p>Intuitive design that makes complex academic processes simple, ensuring users of all technical levels can navigate with ease.</p>
              <div className="solution-badge">
                <span>Easy</span>
              </div>
            </div>

            <div className="solution-card card-premium hover-lift">
              <div className="solution-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3>Robust Password Protection</h3>
              <p>Advanced encryption and security protocols that safeguard your academic data with enterprise-level protection standards.</p>
              <div className="solution-badge">
                <span>Protected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="about-section section-padding">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="about-title gradient-text">About NotedAF</h2>
              <p className="about-description">
                NotedAF is a revolutionary academic platform built with the latest 
                <span className="highlight"> MERN stack technology</span> (MongoDB, Express.js, React, Node.js). 
                We empower teachers and students to create, view, and manage academic content 
                with unprecedented ease and efficiency.
              </p>
              <div className="about-features">
                <div className="about-feature">
                  <div className="feature-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Seamless classroom management through secure email OTP systems</span>
                </div>
                <div className="about-feature">
                  <div className="feature-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Real-time collaboration and note sharing capabilities</span>
                </div>
                <div className="about-feature">
                  <div className="feature-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Advanced post management and academic content organization</span>
                </div>
              </div>
              
              <div className="cta-section">
                <h3>Join Our Community</h3>
                <p>Ready to transform your academic experience? Join thousands of educators and students already using NotedAF.</p>
                <Link to="/signup" className="btn-primary btn-gradient hover-lift">
                  Get Started Today
                </Link>
              </div>
            </div>
            
            <div className="about-visual">
              <div className="stats-container">
                <div className="stat-card card-glass pulse-glow">
                  <div className="stat-number gradient-text">500+</div>
                  <div className="stat-label">Active Users</div>
                </div>
                <div className="stat-card card-glass pulse-glow" style={{animationDelay: '0.5s'}}>
                  <div className="stat-number gradient-text">50+</div>
                  <div className="stat-label">Classrooms</div>
                </div>
                <div className="stat-card card-glass pulse-glow" style={{animationDelay: '1s'}}>
                  <div className="stat-number gradient-text">1000+</div>
                  <div className="stat-label">Notes Shared</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer-section">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3 className="gradient-text">NotedAF</h3>
              <p>Transforming academic experiences with AI-powered solutions.</p>
            </div>
            
            <div className="footer-contact">
              <h4>Get in Touch</h4>
              <div className="contact-item">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>24mcac@kristujayanti.com</span>
              </div>
              <div className="contact-item">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>7899419722</span>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 NotedAF. All rights reserved. Built with passion for academic excellence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;