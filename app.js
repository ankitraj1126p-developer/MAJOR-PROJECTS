const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override')
const ejsMate = require('ejs-Mate');

const app = express();


// app.use((req, res, next) => {
//     res.setHeader(
//         "Content-Security-Policy",
//         "default-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' http://localhost:5000;"
//     );
//     next();
// });

app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "img-src 'self' data: https:; " +
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; " +
        "font-src 'self' data: https://cdnjs.cloudflare.com; " +
        "connect-src 'self' http://localhost:5000;"
    );
    next();
});

const MONGO_URL = 'mongodb://127.0.0.1:27017/Dwellio';

main()
    .then(() => {
        console.log('Connected Successfully');
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}


// EJS Setup

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'/public')));



// Home Route
app.get('/', (req, res) => {
    res.send('Hi I am Alexander');
});


// Index Route
app.get('/listings', async (req, res) => {

    const allListings = await Listing.find({});

    console.log(allListings);

    res.render('listings/index.ejs', { allListings });
});


// New Route
app.get('/listings/new', (req, res) => {

    res.render('listings/new.ejs');

});


// Show Route
app.get('/listings/:id', async (req, res) => {

    let { id } = req.params;

    const listing = await Listing.findById(id);

    res.render('listings/show.ejs', { listing });

});



// Create Route
app.post('/listings', async (req, res) => {
    // Change req.body to req.body.listing
    const newListing = new Listing(req.body.listing); 
    
    await newListing.save();
    res.redirect('/listings');
});

//Edit Route

app.get('/listings/:id/edit', async (req, res) => {

    let { id } = req.params;

    const listing = await Listing.findById(id);

    res.render('listings/edit.ejs', { listing });

});

// Update Route

app.put('/listings/:id', async (req, res) => {

    const { id } = req.params;

    const listing = await Listing.findById(id);

    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.image.url = req.body.listing.image;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;

    await listing.save();

    res.redirect('/listings');
});


// Delete Route 

app.delete('/listings/:id', async (req, res) => {

    let { id } = req.params;

    let deletedListing = await Listing.findByIdAndDelete(id);

    console.log(deletedListing);

    res.redirect('/listings');
});

// Start Server
app.listen(5000, () => {
    console.log('Server is listening on port 5000');
});