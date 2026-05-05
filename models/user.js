const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
    },
    email: {
        type: String,
        unique: [true, "Email already exists"],
        required: [true, "Email is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    accountType: {
        type: String,
        enum: ['traveler', 'host'],
        required: [true, "Please select an account type"],
        default: 'traveler',
    },
    favourites: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Home",
    }
});

module.exports = mongoose.model('User', userSchema);