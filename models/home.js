const mongoose = require('mongoose');
const User = require('./user');

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
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rules: {
        type: String,
    }
});

homeSchema.pre('findOneAndDelete', async function() {
    const homeId = this.getQuery()._id;
    await User.updateMany({}, {
        $pull: {favourites: homeId}
    })
});

module.exports = mongoose.model("Home", homeSchema)