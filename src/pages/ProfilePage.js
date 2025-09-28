import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import './ProfilePage.css';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        bio: '',
        phone: '',
        location: '',
        avatar: null
    });
    const [imageFile, setImageFile] = useState(null);
    const [classroomsCreatedByMe, setClassroomsCreatedByMe] = useState([]);
    const [classroomsJoinedByMe, setClassroomsJoinedByMe] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createClassData, setCreateClassData] = useState({ name: '', description: '' });
    const [stats, setStats] = useState({
        totalClasses: 0,
        joinedClasses: 0,
        completedAssignments: 0,
        totalQuizzes: 0
    });

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
                    setProfileData({
                        name: data.data.name || '',
                        email: data.data.email || '',
                        bio: data.data.bio || '',
                        phone: data.data.phone || '',
                        location: data.data.location || '',
                        avatar: data.data.avatar || null
                    });
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
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/classroomscreatedbyme`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();

            if (response.ok) {
                setClassroomsCreatedByMe(data.data);
                setStats(prev => ({ ...prev, totalClasses: data.data.length }));
            }
        } catch (error) {
            console.error('Error fetching classrooms:', error);
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
                setStats(prev => ({ ...prev, joinedClasses: data.data.length }));
            }
        } catch (error) {
            console.error('Error fetching joined classrooms:', error);
        }
    };

    const handleProfileUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append('name', profileData.name);
            formData.append('bio', profileData.bio);
            formData.append('phone', profileData.phone);
            formData.append('location', profileData.location);
            
            if (imageFile) {
                formData.append('avatar', imageFile);
            }

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/profile/updateprofile`, {
                method: 'PUT',
                body: formData,
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Profile updated successfully!');
                setUser(data.data);
                setEditMode(false);
                setImageFile(null);
            } else {
                toast.error(data.message || 'Failed to update profile.');
            }
        } catch (error) {
            toast.error('Error updating profile.');
        }
    };

    const handleAvatarChange = (file) => {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setProfileData(prev => ({ ...prev, avatar: e.target.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleCreateClass = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createClassData),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Classroom created successfully!');
                setShowCreateModal(false);
                setCreateClassData({ name: '', description: '' });
                fetchClassrooms();
            } else {
                toast.error(data.message || 'Failed to create classroom.');
            }
        } catch (error) {
            toast.error('Error creating classroom.');
        }
    };

    if (loadingUser) {
        return (
            <div className="profile-loading">
                <div className="spinner"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* Profile Header */}
                <Card className="profile-header-card">
                    <div className="profile-header">
                        <div className="profile-avatar-section">
                            <Avatar
                                src={profileData.avatar}
                                name={profileData.name}
                                size="3xl"
                                editable={editMode}
                                onImageChange={handleAvatarChange}
                                className="profile-avatar"
                            />
                            <div className="profile-status">
                                <span className={`status-indicator ${user?.status || 'online'}`}></span>
                                {user?.status || 'Online'}
                            </div>
                        </div>
                        
                        <div className="profile-info">
                            <div className="profile-name-section">
                                {editMode ? (
                                    <Input
                                        value={profileData.name}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                                        className="profile-name-edit"
                                    />
                                ) : (
                                    <h1 className="profile-name">{profileData.name}</h1>
                                )}
                                <span className={`role-badge role-${user?.role}`}>
                                    {user?.role === 'teacher' ? '👨‍🏫 Teacher' : '🎓 Student'}
                                </span>
                            </div>
                            
                            <div className="profile-contact">
                                <span className="profile-email">📧 {profileData.email}</span>
                                {profileData.phone && (
                                    <span className="profile-phone">📱 {profileData.phone}</span>
                                )}
                                {profileData.location && (
                                    <span className="profile-location">📍 {profileData.location}</span>
                                )}
                            </div>

                            <div className="profile-actions">
                                {editMode ? (
                                    <div className="edit-actions">
                                        <Button
                                            variant="primary"
                                            onClick={handleProfileUpdate}
                                        >
                                            Save Changes
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                setEditMode(false);
                                                setProfileData({
                                                    name: user.name || '',
                                                    email: user.email || '',
                                                    bio: user.bio || '',
                                                    phone: user.phone || '',
                                                    location: user.location || '',
                                                    avatar: user.avatar || null
                                                });
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        variant="primary"
                                        onClick={() => setEditMode(true)}
                                        icon={<EditIcon />}
                                    >
                                        Edit Profile
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Profile Details & Bio */}
                <div className="profile-content">
                    <div className="profile-left">
                        <Card>
                            <Card.Header>
                                <h3>About</h3>
                            </Card.Header>
                            <Card.Body>
                                {editMode ? (
                                    <div className="edit-form">
                                        <Input
                                            label="Bio"
                                            type="textarea"
                                            placeholder="Tell us about yourself..."
                                            value={profileData.bio}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                                        />
                                        <Input
                                            label="Phone"
                                            type="tel"
                                            placeholder="+1 (555) 123-4567"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                                        />
                                        <Input
                                            label="Location"
                                            type="text"
                                            placeholder="City, State"
                                            value={profileData.location}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                                        />
                                    </div>
                                ) : (
                                    <div className="profile-bio">
                                        <p>{profileData.bio || 'No bio added yet.'}</p>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>

                        {/* Statistics */}
                        <Card>
                            <Card.Header>
                                <h3>Statistics</h3>
                            </Card.Header>
                            <Card.Body>
                                <div className="stats-grid">
                                    <div className="stat-item">
                                        <div className="stat-value">{stats.totalClasses}</div>
                                        <div className="stat-label">
                                            {user?.role === 'teacher' ? 'Classes Created' : 'Classes Joined'}
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">{stats.completedAssignments}</div>
                                        <div className="stat-label">Assignments</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">{stats.totalQuizzes}</div>
                                        <div className="stat-label">Quizzes</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">4.8</div>
                                        <div className="stat-label">Rating</div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>

                    <div className="profile-right">
                        {/* My Classrooms */}
                        <Card>
                            <Card.Header>
                                <div className="card-header-with-action">
                                    <h3>
                                        {user?.role === 'teacher' ? 'My Classrooms' : 'Joined Classrooms'}
                                    </h3>
                                    {user?.role === 'teacher' && (
                                        <Button
                                            size="sm"
                                            onClick={() => setShowCreateModal(true)}
                                            icon={<PlusIcon />}
                                        >
                                            Create Class
                                        </Button>
                                    )}
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="classrooms-grid">
                                    {(user?.role === 'teacher' ? classroomsCreatedByMe : classroomsJoinedByMe).map(classroom => (
                                        <div key={classroom._id} className="classroom-card" onClick={() => navigate(`/classes/${classroom._id}`)}>
                                            <div className="classroom-header">
                                                <h4>{classroom.name}</h4>
                                                <span className="classroom-code">{classroom.classCode}</span>
                                            </div>
                                            <p className="classroom-description">{classroom.description}</p>
                                            <div className="classroom-stats">
                                                <span>👥 {classroom.students?.length || 0} students</span>
                                                <span>📚 {classroom.posts?.length || 0} posts</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {(user?.role === 'teacher' ? classroomsCreatedByMe : classroomsJoinedByMe).length === 0 && (
                                    <div className="empty-state">
                                        <p>No classrooms found.</p>
                                        {user?.role === 'teacher' && (
                                            <Button onClick={() => setShowCreateModal(true)}>
                                                Create Your First Class
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </Card.Body>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <Card.Header>
                                <h3>Quick Actions</h3>
                            </Card.Header>
                            <Card.Body>
                                <div className="quick-actions">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => navigate('/quiz')}
                                        icon={<QuizIcon />}
                                        className="action-button"
                                    >
                                        Take Quiz
                                    </Button>
                                    {user?.role === 'teacher' && (
                                        <Button 
                                            variant="outline" 
                                            onClick={() => navigate('/content')}
                                            icon={<ContentIcon />}
                                            className="action-button"
                                        >
                                            Manage Content
                                        </Button>
                                    )}
                                    <Button 
                                        variant="outline" 
                                        onClick={() => navigate('/settings')}
                                        icon={<SettingsIcon />}
                                        className="action-button"
                                    >
                                        Settings
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Create Classroom Modal */}
            {showCreateModal && (
                <div className="modal-overlay">
                    <Card className="modal-content">
                        <Card.Header>
                            <h3>Create New Classroom</h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="modal-form">
                                <Input
                                    label="Classroom Name"
                                    value={createClassData.name}
                                    onChange={(e) => setCreateClassData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter classroom name"
                                />
                                <Input
                                    label="Description"
                                    type="textarea"
                                    value={createClassData.description}
                                    onChange={(e) => setCreateClassData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Enter classroom description"
                                />
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <div className="modal-actions">
                                <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCreateClass}>
                                    Create Classroom
                                </Button>
                            </div>
                        </Card.Footer>
                    </Card>
                </div>
            )}
        </div>
    );
};

// Icon Components
const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const QuizIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h4v-9z" />
        <path d="M9 11V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6" />
        <path d="M15 11v9h4a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4z" />
    </svg>
);

const ContentIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10,9 9,9 8,9" />
    </svg>
);

const SettingsIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m15.5-7.5L19 9m-7-7L9.5 4.5M19 15l-2.5 2.5M12 19L9.5 16.5M1 9l2.5-2.5" />
    </svg>
);

export default ProfilePage;