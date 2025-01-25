import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios'; // Import Axios
import './ClassesDetails.css';


const ClassesDetails = () => {
  const { classid } = useParams();
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [textToSummarize, setTextToSummarize] = useState(''); // State for input text
  const [summary, setSummary] = useState(''); // State for summarized text
  const [summarizing, setSummarizing] = useState(false); // State for loading

  const fetchClassDetails = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/getclassbyid/${classid}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setClassroom(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch class details');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [classid]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/getuser`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch user data');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchClassDetails();
    fetchUserData();
  }, [classid, fetchClassDetails]);

  const handleAddPost = () => setShowPopup(true);

  const handleSubmitPost = async () => {
    if (!postTitle || !postDescription) {
      toast.error('Please fill out all fields');
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/addpost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: postTitle, description: postDescription, classId: classid }),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Post created successfully');
        setPostTitle('');
        setPostDescription('');
        setShowPopup(false);
        fetchClassDetails();
      } else {
        throw new Error(data.message || 'Failed to create post');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClosePopup = () => setShowPopup(false);

  const handleJoinRequest = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/request-to-join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classroomId: classid, studentEmail: user?.email }),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setShowJoinPopup(false);
        setShowOtpPopup(true);
        toast.success('OTP sent to the class owner');
      } else {
        throw new Error(data.message || 'Failed to send join request');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmitOtp = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classroomId: classid, studentEmail: user?.email, otp }),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setOtp('');
        setShowOtpPopup(false);
        toast.success('Successfully joined the class');
        fetchClassDetails();
      } else {
        setOtpError(data.message || 'Failed to verify OTP');
      }
    } catch (error) {
      toast.error('An error occurred while verifying OTP');
    }
  };

  const handleCloseOtpPopup = () => {
    setShowOtpPopup(false);
    setOtpError('');
  };

  const handleSummarize = async () => {
    if (!textToSummarize) {
      toast.error('Please enter text to summarize');
      return;
    }
  
    setSummarizing(true);
    try {
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
      const prompt = `Summarize the following text:\n\n${textToSummarize}`;
      const result = await model.generateContent(prompt);
  
      if (result && result.response && result.response.text) {
        setSummary(result.response.text());
      } else {
        throw new Error('Failed to summarize text');
      }
    } catch (error) {
      if (error.response) {
        toast.error(`Error: ${error.response.status} ${error.response.statusText}`);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        toast.error('No response received from the server');
        console.error('Request data:', error.request);
      } else {
        toast.error(`Error: ${error.message}`);
        console.error('Error message:', error.message);
      }
    } finally {
      setSummarizing(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const isStudent = classroom?.students?.includes(user?.email);
  const isOwner = classroom?.owner === user?._id;

  return (
    <div className="class-details">
      <div className="section1">
        <h1 className="class-name">{classroom?.name}</h1>
        <p className="class-description">{classroom?.description}</p>

        {isOwner && (
          <button className="add-post-btn" onClick={handleAddPost}>Add Post</button>
        )}

        {!isStudent && !isOwner && (
          <button className="add-post-btn" onClick={() => setShowJoinPopup(true)}>Join Class</button>
        )}
      </div>

      <div className="post-grid">
        {(isStudent || isOwner) && classroom?.posts?.length > 0 ? (
          classroom.posts.map((post, index) => (
            <div key={index} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <small>{new Date(post.createdAt).toLocaleDateString()}</small>
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Add Post</h3>
            <input
              type="text"
              placeholder="Title"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={postDescription}
              onChange={(e) => setPostDescription(e.target.value)}
            />
            <div className="popup-buttons">
              <button onClick={handleSubmitPost}>Submit</button>
              <button onClick={handleClosePopup}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showJoinPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Join Request</h3>
            <p>Do you want to join this class? An OTP will be sent to the class owner for approval.</p>
            <div className="popup-buttons">
              <button onClick={handleJoinRequest}>Send Join Request</button>
              <button onClick={() => setShowJoinPopup(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showOtpPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Enter OTP</h3>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {otpError && <p className="otp-error">{otpError}</p>}
            <div className="popup-buttons">
              <button onClick={handleSubmitOtp}>Submit</button>
              <button onClick={handleCloseOtpPopup}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Summarization Feature */}
      <div className="summarization-section">
        <h3>Summarize Text</h3>
        <textarea
          placeholder="Paste text here..."
          value={textToSummarize}
          onChange={(e) => setTextToSummarize(e.target.value)}
        />
        <button onClick={handleSummarize} disabled={summarizing}>
          {summarizing ? 'Summarizing...' : 'Summarize'}
        </button>
        {summary && (
          <div className="summary-output">
            <h4>Summary:</h4>
            <p>{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassesDetails;