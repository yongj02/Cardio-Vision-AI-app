import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.jpeg'; // Make sure you have a logo image in your assets folder

const Navbar = () => {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const handleAuthAction = () => {
        if (isLoggedIn) {
            setShowModal(true); // Show the confirmation modal
        } else {
            navigate('/login');
        }
    };

    const handleLogoutConfirm = () => {
        logout();
        navigate('/');
        setShowModal(false); // Hide the modal after logout
    };

    const handleLogoutCancel = () => {
        setShowModal(false); // Hide the modal without logging out
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link className="navbar-brand" to="/">
                    <img src={logo} alt="CardioVisionAI" style={{ height: '30px' }} />
                    &nbsp;Cardio Vision AI
                </Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/prediction">Prediction</Link>
                        </li>
                        <li className="nav-item">
                            <span
                                className={`nav-link ${isLoggedIn ? '' : 'disabled'}`}
                                style={{ cursor: isLoggedIn ? 'pointer' : 'default' }}
                                onClick={() => isLoggedIn && navigate('/profile')}
                            >
                                Profile
                            </span>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`btn ${isLoggedIn ? 'btn-danger' : 'btn-primary'}`} // Changed to btn-danger
                                onClick={handleAuthAction}
                            >
                                {isLoggedIn ? 'Log Out' : 'Log In'}
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Bootstrap Modal for logout confirmation */}
            <div className={`modal fade ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }} aria-labelledby="logoutModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="logoutModalLabel">Confirm Logout</h5>
                            <button type="button" className="btn-close" onClick={handleLogoutCancel} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to log out?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleLogoutCancel}>Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={handleLogoutConfirm}>Log Out</button> {/* Changed to btn-danger */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
