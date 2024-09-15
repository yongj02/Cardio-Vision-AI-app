import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [alertType, setAlertType] = useState(''); // 'success' or 'danger'
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateInputs = () => {
        const newErrors = {};
        if (!username) newErrors.username = 'Username is required';
        if (!password) newErrors.password = 'Password is required';
        return newErrors;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            await login(username, password);
            setMessage('Login successful! Redirecting...');
            setAlertType('success');
            setTimeout(() => {
                navigate('/prediction');
            }, 2000); // Wait 2 seconds before navigation
        } catch (error) {
            setMessage('Login failed. Please check your username and password.');
            setAlertType('danger');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
        if (name === 'username') {
            setUsername(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            {message && (
                <div className={`alert alert-${alertType}`} role="alert">
                    {message}
                </div>
            )}
            <Form onSubmit={handleLogin}>
                <Form.Group controlId="username" className="element-space-bottom">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={username}
                        onChange={handleInputChange}
                        isInvalid={!!errors.username}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.username}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="password" className="element-space-bottom">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleInputChange}
                        isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.password}
                    </Form.Control.Feedback>
                </Form.Group>
                <Button type="submit" variant="primary">Log In</Button>
            </Form>
            <p className="mt-3">
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
        </div>
    );
};

export default LoginPage;