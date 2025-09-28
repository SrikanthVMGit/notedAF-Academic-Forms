import React, { useState } from 'react';
import './Avatar.css';

const Avatar = ({ 
  src, 
  alt = 'Avatar', 
  size = 'md', 
  name,
  editable = false,
  onImageChange,
  className = '',
  fallbackColor = 'primary'
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && onImageChange) {
      onImageChange(file);
    }
  };

  const showFallback = !src || imageError;

  return (
    <div 
      className={`avatar avatar-${size} ${className} ${editable ? 'avatar-editable' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!showFallback ? (
        <img
          src={src}
          alt={alt}
          className="avatar-image"
          onError={handleImageError}
        />
      ) : (
        <div className={`avatar-fallback avatar-fallback-${fallbackColor}`}>
          {getInitials(name)}
        </div>
      )}
      
      {editable && (
        <>
          <div className={`avatar-overlay ${isHovered ? 'visible' : ''}`}>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="avatar-edit-icon"
            >
              <path 
                d="M12 9C13.38 9 14.5 10.12 14.5 11.5C14.5 12.88 13.38 14 12 14C10.62 14 9.5 12.88 9.5 11.5C9.5 10.12 10.62 9 12 9ZM12 7C9.52 7 7.5 9.02 7.5 11.5C7.5 13.98 9.52 16 12 16C14.48 16 16.5 13.98 16.5 11.5C16.5 9.02 14.48 7 12 7ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17Z" 
                fill="currentColor"
              />
              <path 
                d="M3 5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5ZM5 19H19V5H5V19Z" 
                fill="currentColor"
              />
            </svg>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="avatar-input"
            aria-label="Change profile picture"
          />
        </>
      )}
    </div>
  );
};

export default Avatar;