
const mongoose = require("mongoose");

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(
        `MongoDB Connected: ${conn.connection.host}`
    );

    return conn;
};

module.exports = connectDB;
