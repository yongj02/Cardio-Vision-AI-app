import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const ManualEntry = ({ addPatient }) => {
    const [newPatient, setNewPatient] = useState({
        age: '',
        gender: '',
        chestPainType: '',
        restingBP: '',
        cholesterol: '',
        fastingBS: '',
        restingECG: '',
        maxHR: '',
        exerciseAngina: '',
        oldpeak: '',
        stSlope: '',
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
                newPatient.chestPainType,
                Number(newPatient.restingBP),
                Number(newPatient.cholesterol),
                Number(newPatient.fastingBS),
                newPatient.restingECG,
                Number(newPatient.maxHR),
                newPatient.exerciseAngina,
                Number(newPatient.oldpeak),
                newPatient.stSlope,
            ]];
            setNewPatient({
                age: '',
                gender: '',
                chestPainType: '',
                restingBP: '',
                cholesterol: '',
                fastingBS: '',
                restingECG: '',
                maxHR: '',
                exerciseAngina: '',
                oldpeak: '',
                stSlope: '',
            });
            setErrors({});
            addPatient(patientValues);
        }
    };

    return (
        <div>
            <Form>
                <Form.Group controlId="age" className="mb-3">
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
                <Form.Group controlId="gender" className="mb-3">
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
                <Form.Group controlId="chestPainType" className="mb-3">
                    <Form.Label>Chest Pain Type</Form.Label>
                    <Form.Control
                        as="select"
                        name="chestPainType"
                        value={newPatient.chestPainType}
                        onChange={handleInputChange}
                        isInvalid={!!errors.chestPainType}
                    >
                        <option value="">Select...</option>
                        <option value="ATA">ATA</option>
                        <option value="NAP">NAP</option>
                        <option value="ASY">ASY</option>
                        <option value="TA">TA</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.chestPainType}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="restingBP" className="mb-3">
                    <Form.Label>Resting Blood Pressure (mmHg)</Form.Label>
                    <Form.Control
                        type="number"
                        name="restingBP"
                        value={newPatient.restingBP}
                        onChange={handleInputChange}
                        isInvalid={!!errors.restingBP}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.restingBP}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="cholesterol" className="mb-3">
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
                <Form.Group controlId="fastingBS" className="mb-3">
                    <Form.Label>Fasting Blood Sugar (mg/dL)</Form.Label>
                    <Form.Control
                        type="number"
                        name="fastingBS"
                        value={newPatient.fastingBS}
                        onChange={handleInputChange}
                        isInvalid={!!errors.fastingBS}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.fastingBS}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="restingECG" className="mb-3">
                    <Form.Label>Resting Electrocardiographic Results</Form.Label>
                    <Form.Control
                        as="select"
                        name="restingECG"
                        value={newPatient.restingECG}
                        onChange={handleInputChange}
                        isInvalid={!!errors.restingECG}
                    >
                        <option value="">Select...</option>
                        <option value="Normal">Normal</option>
                        <option value="ST">ST</option>
                        <option value="Hypertrophy">Hypertrophy</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.restingECG}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="maxHR" className="mb-3">
                    <Form.Label>Max Heart Rate Achieved</Form.Label>
                    <Form.Control
                        type="number"
                        name="maxHR"
                        value={newPatient.maxHR}
                        onChange={handleInputChange}
                        isInvalid={!!errors.maxHR}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.maxHR}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="exerciseAngina" className="mb-3">
                    <Form.Label>Exercise Induced Angina</Form.Label>
                    <Form.Control
                        as="select"
                        name="exerciseAngina"
                        value={newPatient.exerciseAngina}
                        onChange={handleInputChange}
                        isInvalid={!!errors.exerciseAngina}
                    >
                        <option value="">Select...</option>
                        <option value="Y">Yes</option>
                        <option value="N">No</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.exerciseAngina}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="oldpeak" className="mb-3">
                    <Form.Label>Oldpeak (depression induced by exercise relative to rest)</Form.Label>
                    <Form.Control
                        type="number"
                        step="0.1"
                        name="oldpeak"
                        value={newPatient.oldpeak}
                        onChange={handleInputChange}
                        isInvalid={!!errors.oldpeak}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.oldpeak}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="stSlope" className="mb-3">
                    <Form.Label>ST Slope</Form.Label>
                    <Form.Control
                        as="select"
                        name="stSlope"
                        value={newPatient.stSlope}
                        onChange={handleInputChange}
                        isInvalid={!!errors.stSlope}
                    >
                        <option value="">Select...</option>
                        <option value="Up">Up</option>
                        <option value="Flat">Flat</option>
                        <option value="Down">Down</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.stSlope}
                    </Form.Control.Feedback>
                </Form.Group>
                <Button className="mb-3" variant="primary" onClick={handleAddPatient}>
                    Add Patient
                </Button>
            </Form>
        </div>
    );
};

export default ManualEntry;
