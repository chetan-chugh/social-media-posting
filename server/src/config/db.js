const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

exports.connectToDB = async (req, res) => {
    try {
        await mongoose.connect(process.env.DATABASE_URL),{

        }
        console.log('Databse connect sucessfully');
    } catch (error) {
        console.log("Error while connection to Database");
    }
}