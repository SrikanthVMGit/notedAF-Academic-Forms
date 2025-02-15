import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [creatingClass, setCreatingClass] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [classroomName, setClassroomName] = useState('');
    const [description, setDescription] = useState('');
    const [classroomsCreatedByMe, setClassroomsCreatedByMe] = useState([]);
    const [classroomsJoinedByMe, setClassroomsJoinedByMe] = useState([]);

    const navigate = useNavigate();

    // Fetch user data
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
                } else {
                    toast.error(data.message || 'Failed to fetch user data.');
                }
            } catch (error) {
                toast.error('Error fetching user data.');
            } finally {
                setLoadingUser(false);
            }
        };
        fetchUser();
    }, []);

    // Fetch classrooms data
    useEffect(() => {
        if (user) {
            fetchClassrooms();
            if (user.role !== 'teacher') {
                fetchJoinedClassrooms();
            }
        }
    }, [user]);

    const fetchClassrooms = async () => {
        setLoadingClasses(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/classroomscreatedbyme`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();

            if (response.ok) {
                setClassroomsCreatedByMe(data.data);
            } else {
                toast.error(data.message || 'Failed to fetch created classrooms.');
            }
        } catch (error) {
            toast.error('Error fetching created classrooms.');
        } finally {
            setLoadingClasses(false);
        }
    };

    const fetchJoinedClassrooms = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/classroomsforstudent`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();

            if (response.ok) {
                setClassroomsJoinedByMe(data.data);
            } else {
                toast.error(data.message || 'Failed to fetch joined classrooms.');
            }
        } catch (error) {
            toast.error('Error fetching joined classrooms.');
        }
    };

    const handleCreateClassroom = async () => {
        if (!classroomName || !description) {
            toast.error('Classroom name and description are required.');
            return;
        }

        setCreatingClass(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: classroomName, description }),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Classroom created successfully!');
                setClassroomName('');
                setDescription('');
                setShowPopup(false);
                fetchClassrooms();
            } else {
                toast.error(data.message || 'Failed to create classroom.');
            }
        } catch (error) {
            toast.error('Error creating classroom.');
        } finally {
            setCreatingClass(false);
        }
    };

    const handleRowClick = (classroomId) => {
        navigate(`/classes/${classroomId}`);
    };

    return (
        <div className="profile-page">
            {loadingUser ? (
                <div className="loading">Loading user data...</div>
            ) : user ? (
                <>
                    <h1>Profile</h1>
                    <div className="profile-info">
                        <img
                            src="https://th.bing.com/th/id/OIP.OWHqt6GY5jrr7ETvJr8ZXwHaHa?w=160&h=180&c=7&r=0&o=5&pid=1.7"
                            alt="Profile"
                            className="profile-picture"
                        />
                        <div className="profile-details">
                            <h2>{user.name}</h2>
                            <p>Email: {user.email}</p>
                            <p>Role: {user.role}</p>
                            {user.role === 'teacher' && (
                                <button onClick={() => setShowPopup(true)} className="create-classroom-btn">
                                    Create Classroom
                                </button>
                            )}
                        </div>
                    </div>

                    {showPopup && (
                        <div className="popup-overlay">
                            <div className="popup-content">
                                <h3>Create Classroom</h3>
                                <input
                                    type="text"
                                    placeholder="Classroom Name"
                                    value={classroomName}
                                    onChange={(e) => setClassroomName(e.target.value)}
                                />
                                <textarea
                                    placeholder="Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <div className="popup-buttons">
                                    <button onClick={handleCreateClassroom} disabled={creatingClass}>
                                        {creatingClass ? 'Creating...' : 'Submit'}
                                    </button>
                                    <button onClick={() => setShowPopup(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {user.role === 'teacher' && (
                        <div className="classroom-list">
                            <h3>Classrooms Created by Me</h3>
                            {loadingClasses ? (
                                <p>Loading classrooms...</p>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classroomsCreatedByMe.map((classroom) => (
                                            <tr key={classroom._id} onClick={() => handleRowClick(classroom._id)}>
                                                <td>{classroom.name}</td>
                                                <td>{classroom.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {user.role !== 'teacher' && (
                        <div className="classroom-list">
                            <h3>Classrooms Joined by Me</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classroomsJoinedByMe.map((classroom) => (
                                        <tr key={classroom._id} onClick={() => handleRowClick(classroom._id)}>
                                            <td>{classroom.name}</td>
                                            <td>{classroom.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <button onClick={() => navigate('/quiz')} className="take-quiz-btn">
                        Take a Quiz
                    </button>
                </>
            ) : (
                <p>No user data found.</p>
            )}
        </div>
    );
};

export default ProfilePage;