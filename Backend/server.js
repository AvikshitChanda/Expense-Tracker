const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const databaseConnect = require('./config/databaseConnect');
const transactionRoutes = require('./routes/transactions');
const authRoutes = require('./routes/authRoute'); 

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

databaseConnect();


app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes); 


app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
