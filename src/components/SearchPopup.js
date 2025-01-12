import React, { useState, useEffect } from 'react';
import './SearchPopup.css';
import { useNavigate } from 'react-router-dom';

const SearchPopup = ({ onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Debounce the search term to avoid too many API requests
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm) {
                fetchSearchResults(searchTerm);
            } else {
                setResults([]);
            }
        }, 500); // Adjust debounce delay as needed

        return () => clearTimeout(delayDebounceFn); // Cleanup timeout on change
    }, [searchTerm]);

    const fetchSearchResults = async (term) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/classrooms/search?term=${encodeURIComponent(term)}`);

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();
            setResults(data.data);
        } catch (error) {
            setError('Search failed. Please try again.');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleItemClick = (id) => {
        navigate(`/classes/${id}`);
        onClose();
    };

    return (
        <div className="search-popup">
            <div className="search-popup-content">
                <div className='searchContainer'>
                    <input
                        type="text"
                        placeholder="Search for classrooms..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        aria-label="Search classrooms"
                    />
                    <button
                        className="search-popup-close"
                        onClick={onClose}
                        aria-label="Close search popup"
                    >
                        x
                    </button>
                </div>

                {loading && <div className="loading">Loading...</div>}
                {error && <div className="error">{error}</div>}

                <ul className="search-results">
                    {results.length > 0 ? (
                        results.map((result) => (
                            <li key={result._id} onClick={() => handleItemClick(result._id)}>
                                <span>{result.name}</span>
                            </li>
                        ))
                    ) : (
                        !loading && <li>No results found</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default SearchPopup;
