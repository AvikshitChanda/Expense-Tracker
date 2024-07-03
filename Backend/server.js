const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const databaseConnect = require('./config/databaseConnect');
const transactionRoutes = require('./routes/transactions');
const authRoutes = require('./routes/authRoute'); // Import authRoutes

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
databaseConnect();

// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes); // Mount authRoutes

// Start server
app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
