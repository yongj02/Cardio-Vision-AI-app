import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const ManualEntry = ({ addPatient }) => {
    const [newPatient, setNewPatient] = useState({
        age: '',
        gender: '',
        bloodPressure: '',
        cholesterol: '',
        smoking: '',
        diabetes: '',
        bmi: '',
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPatient({ ...newPatient, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateInputs = () => {
        const newErrors = {};
        Object.keys(newPatient).forEach((key) => {
            if (!newPatient[key]) {
                newErrors[key] = 'This field is required';
            }
        });
        return newErrors;
    };

    const handleAddPatient = () => {
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            const patientValues = [[
                Number(newPatient.age),
                newPatient.gender,
                Number(newPatient.bloodPressure),
                Number(newPatient.cholesterol),
                newPatient.smoking,
                newPatient.diabetes,
                Number(newPatient.bmi),
            ]];
            setNewPatient({
                age: '',
                gender: '',
                bloodPressure: '',
                cholesterol: '',
                smoking: '',
                diabetes: '',
                bmi: '',
            });
            setErrors({});
            addPatient(patientValues); 
        }
    };

    return (
        <div>
            <Form>
                <Form.Group controlId="age">
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                        type="number"
                        name="age"
                        value={newPatient.age}
                        onChange={handleInputChange}
                        isInvalid={!!errors.age}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.age}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="gender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Control
                        as="select"
                        name="gender"
                        value={newPatient.gender}
                        onChange={handleInputChange}
                        isInvalid={!!errors.gender}
                    >
                        <option value="">Select...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.gender}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="bloodPressure">
                    <Form.Label>Blood Pressure (mmHg)</Form.Label>
                    <Form.Control
                        type="number"
                        name="bloodPressure"
                        value={newPatient.bloodPressure}
                        onChange={handleInputChange}
                        isInvalid={!!errors.bloodPressure}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.bloodPressure}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="cholesterol">
                    <Form.Label>Cholesterol Levels (mg/dL)</Form.Label>
                    <Form.Control
                        type="number"
                        name="cholesterol"
                        value={newPatient.cholesterol}
                        onChange={handleInputChange}
                        isInvalid={!!errors.cholesterol}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.cholesterol}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="smoking">
                    <Form.Label>Smoking Status</Form.Label>
                    <Form.Control
                        as="select"
                        name="smoking"
                        value={newPatient.smoking}
                        onChange={handleInputChange}
                        isInvalid={!!errors.smoking}
                    >
                        <option value="">Select...</option>
                        <option value="Non-smoker">Non-smoker</option>
                        <option value="Former smoker">Former smoker</option>
                        <option value="Current smoker">Current smoker</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.smoking}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="diabetes">
                    <Form.Label>Diabetes</Form.Label>
                    <Form.Control
                        as="select"
                        name="diabetes"
                        value={newPatient.diabetes}
                        onChange={handleInputChange}
                        isInvalid={!!errors.diabetes}
                    >
                        <option value="">Select...</option>
                        <option value="No">No</option>
                        <option value="Yes, Type 1">Yes, Type 1</option>
                        <option value="Yes, Type 2">Yes, Type 2</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.diabetes}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="bmi">
                    <Form.Label>BMI (kg/m²)</Form.Label>
                    <Form.Control
                        type="number"
                        name="bmi"
                        value={newPatient.bmi}
                        onChange={handleInputChange}
                        isInvalid={!!errors.bmi}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.bmi}
                    </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" onClick={handleAddPatient}>
                    Add Patient
                </Button>
            </Form>
        </div>
    );
};

export default ManualEntry;
