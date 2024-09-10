// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.jpeg'; // Make sure you have a logo image in your assets folder

const Navbar = () => {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleAuthAction = () => {
        if (isLoggedIn) {
            logout();
            navigate('/');
        } else {
            navigate('/login');
        }
    };

    return (
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
                            className={`btn ${isLoggedIn ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={handleAuthAction}
                        >
                            {isLoggedIn ? 'Log Out' : 'Log In'}
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
