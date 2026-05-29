const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('../models/Product');
const { data } = require('./data');

dotenv.config({ path: path.join(__dirname, '../.env') });

const initDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error("Error: MONGODB_URI is not defined in .env file");
    process.exit(1);
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for initialization...");

    await Product.deleteMany({});
    console.log("Existing products cleared.");

    await Product.insertMany(data);
    console.log("Sample products inserted successfully.");

    process.exit();
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
};

initDB();
