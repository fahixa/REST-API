// filename : connection.js

// import mongoose
const mongoose = require('mongoose');

// connection to mongoDB

const connectDB = async () => {
    try{
        // url to database
        const con = await mongoose.connect('mongodb://localhost:27017/StudyCase');
        // log connection
        console.log(`MongoDB Connected: ${con.connection.host}`);
    } catch(err){
        // log error
        console.log(err);
        // shutdown server
        process.exit(1);
    }
}

module.exports = connectDB;