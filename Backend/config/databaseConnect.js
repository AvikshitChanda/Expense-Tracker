require('dotenv').config();
const mongoose = require('mongoose');

const databaseConnect = async() => {
    mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            console.log("Database connected!");
        })
        .catch((error) => {
            console.error('Error connecting to the database:', error);
        });
};

module.exports = databaseConnect;
