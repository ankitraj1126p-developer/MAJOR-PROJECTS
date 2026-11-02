const mongoose = require('mongoose');

const initData = require('./data.js');

const Listing = require('../models/listing.js');

const MONGO_URL = 'mongodb://127.0.0.1:27017/Dwellio';

main()
    .then(() => {
        console.log('Connected Successfully');
        return initDB();
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

// Initialize Database

const initDB = async () => {

    await Listing.deleteMany({});

    await Listing.insertMany(initData.data);

    console.log('Data was initialized');

    await mongoose.connection.close();
};