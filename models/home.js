const mongoose = require('mongoose');
const Favourites = require('../models/favorites');

const homeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
});

homeSchema.pre('findOneAndDelete', async function() {
    const homeId = this.getQuery()._id;
    await Favourites.deleteMany({homeId});
});

module.exports = mongoose.model("Home", homeSchema)