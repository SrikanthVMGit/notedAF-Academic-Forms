import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import SearchPopup from './SearchPopup';
import { IoSearchCircleOutline } from "react-icons/io5";

const Navbar = ({ showSearch = true, showLogout = true }) => {
    const { auth, logout } = useAuth();
    const [showPopup, setShowPopup] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleLogoClick = (e) => {
        e.preventDefault();
        if (auth.user) {
            navigate('/home');
        }
    };

    const handleLogoutClick = () => {
        logout();
    };

    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    return (
        <nav className="navbar">
            {/* Left Section */}
            <div className="navbar-left">
                {isAuthPage ? (
                    <span className="logo">Noted AF</span>
                ) : (
                    <Link to="#" className="logo" onClick={handleLogoClick}>Noted AF</Link>
                )}

                
            </div>

            {/* Right Section */}
            <div className={`navbar-right ${mobileMenuOpen ? 'open' : ''}`}>
            {!isAuthPage && showSearch && (
                    <>
                        <span className="search-text">Search Classes:</span>
                        <IoSearchCircleOutline
                            onClick={togglePopup}
                            className="search-icon"
                            size={32} // Adjust the size as needed
                        />

                        {showPopup && <SearchPopup onClose={togglePopup} />}
                    </>
                )}
                {auth.user && !isAuthPage ? (
                    <>
                        <Link to="/profile" className="profile-btn">Profile</Link>
                        {showLogout && <button onClick={handleLogoutClick} className="logout-btn">Logout</button>}
                    </>
                ) : (
                    !isAuthPage && <Link to="/login" className="login-btn">Login</Link>
                )}
            </div>

            {/* Mobile Menu Icon */}
            <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="menu-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </div>
        </nav>
    );
};

export default Navbar;