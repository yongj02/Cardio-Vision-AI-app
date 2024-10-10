const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const datasetRoutes = require('./routes/datasetRoutes'); // Import dataset routes
const predictRoutes = require('./routes/predictionRoutes');
const cors = require('cors'); // Import cors

dotenv.config();
connectDB();

const app = express();

// CORS configuration
const corsOptions = {
  origin: '*', // Allow requests from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
  credentials: true, // Allow credentials (if needed)
};

app.use(cors(corsOptions)); 
app.use(express.json());

app.use('/uploads', express.static('uploads')); 
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/datasets', datasetRoutes);
app.use('/api/predict', predictRoutes);

const PORT = parseInt(process.env.PORT || "8000", 10);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});