const mongoose = require("mongoose");
const Home = require("./home");

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
        unique: [true, "Email already taken"],
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
    bio: {
        type: String,
        maxlength: [200, "Bio cannot exceed 200 characters"],
    },
    profilePicture: {
        type: String,
        default: '/images/default-pfp.webp',
    },
    favourites: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Home",
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
    phoneNumber: {
        type: Number,
    },
});

userSchema.pre('findOneAndDelete', async function() {
    const userId = this.getQuery()._id;
    await Home.deleteMany({ owner: userId });
});

module.exports = mongoose.model('User', userSchema);