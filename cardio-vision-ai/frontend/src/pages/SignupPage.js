import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Form, Button } from 'react-bootstrap';

const Signup = () => {
    const { register } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [alertType, setAlertType] = useState(''); // 'success' or 'danger'
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateInputs = () => {
        const newErrors = {};
        if (!name) newErrors.name = 'Name is required';
        if (!username) newErrors.username = 'Username is required';
        if (!password) newErrors.password = 'Password is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            await register(name, username, password);
            setMessage('Registration successful!');
            setAlertType('success');
            setTimeout(() => {
                navigate('/prediction');
            }, 2000); // Wait 2 seconds before navigation
        } catch (error) {
            setMessage('Registration failed. Username has been taken.');
            setAlertType('danger');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
        if (name === 'name') {
            setName(value);
        } else if (name === 'username') {
            setUsername(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    return (
        <div className="container">
            <h2>Sign Up</h2>
            {message && (
                <div className={`alert alert-${alertType}`} role="alert">
                    {message}
                </div>
            )}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={name}
                        onChange={handleInputChange}
                        isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.name}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="username">
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
                <Form.Group controlId="password">
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
                <Button type="submit" variant="primary">Sign Up</Button>
            </Form>
            <p className="mt-3">
                Have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
};

export default Signup;