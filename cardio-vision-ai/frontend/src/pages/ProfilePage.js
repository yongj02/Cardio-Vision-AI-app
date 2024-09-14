import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Button, Card, Container, Row, Col, Modal, Form, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify'; // Import the toast functionality
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { AuthContext } from '../context/AuthContext'; 

// Import toast CSS
import 'react-toastify/dist/ReactToastify.css';

const ProfilePage = () => {
    const { token } = useContext(AuthContext);
    const [results, setResults] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [renamingId, setRenamingId] = useState(null);
    const [newName, setNewName] = useState('');
    const [nameError, setNameError] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(''); // 'success' or 'danger'
    const navigate = useNavigate(); // Initialize navigate for redirection

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get('/api/patients/results', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setResults(response.data);
            } catch (error) {
                toast.error('Failed to fetch results');
            }
        };

        fetchResults();
    }, []);

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/patients/delete/${deletingId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResults(results.filter(result => result._id !== deletingId));
            setAlertType('success');
            setAlertMessage('Result deleted successfully');
            setDeletingId(null); // Close the modal
            setShowModal(false);
            setTimeout(() => setAlertMessage(''), 3000); // Hide alert after 3 seconds
        } catch (error) {
            setAlertType('danger');
            setAlertMessage('Failed to delete result');
        }
    };

    const handleRename = async () => {
        if (!newName.trim()) {
            setNameError(true);
            return;
        }
        try {
            await axios.put(`/api/patients/update/name/${renamingId}`, { name: newName }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResults(results.map(result =>
                result._id === renamingId ? { ...result, name: newName } : result
            ));
            setAlertType('success');
            setAlertMessage('Result renamed successfully');
            setNewName('');
            setNameError(false);
            setRenamingId(null); // Close the modal
            setShowModal(false);
            setTimeout(() => setAlertMessage(''), 3000); // Hide alert after 3 seconds
        } catch (error) {
            setAlertType('danger');
            setAlertMessage('Failed to rename result');
        }
    };

    const handleShowModal = (id) => {
        setDeletingId(id);
        setShowModal(true);
    };

    const handleShowRenameModal = (id) => {
        setRenamingId(id);
        setNewName('');
        setNameError(false);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setDeletingId(null);
        setRenamingId(null);
    };

    return (
        <Container className="my-4">
            <h2 className="mb-4">Profile</h2>
            {alertMessage && (
                <Alert variant={alertType} className="mb-4">
                    {alertMessage}
                </Alert>
            )}
            <p className="mb-4">Manage your prediction results here.</p>
            <Row>
                {results.map(result => (
                    <Col key={result._id} md={4} className="mb-4">
                        <Card className="d-flex flex-column h-100">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title>{result.name}</Card.Title>
                                <Card.Text className="flex-grow-1">
                                    <strong>Patients:</strong> {result.savedPatients.length}
                                </Card.Text>
                                <div className="mt-auto d-flex justify-content-between">
                                    <Button 
                                        variant="primary" 
                                        className="me-2"
                                        onClick={() => navigate('/results', { state: { results: result, isSaved: true } })}
                                    >
                                        View
                                    </Button>
                                    <Button 
                                        variant="secondary" 
                                        className="me-2"
                                        onClick={() => handleShowRenameModal(result._id)}
                                    >
                                        Rename
                                    </Button>
                                    <Button 
                                        variant="danger" 
                                        onClick={() => handleShowModal(result._id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Rename Modal */}
            <Modal show={renamingId !== null} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Rename Result</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNewName">
                            <Form.Label>New Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newName}
                                onChange={(e) => {
                                    setNewName(e.target.value);
                                    if (e.target.value.trim()) setNameError(false);
                                }}
                                isInvalid={nameError}
                                placeholder="Enter new name"
                            />
                            <Form.Control.Feedback type="invalid">
                                Name is required.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleRename}>
                        Rename
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Confirmation Modal */}
            <Modal show={deletingId !== null} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this result?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ProfilePage;
