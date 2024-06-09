import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    // googleId is unique for each google user
    googleId: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        minlength: 6
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "others", "unknown"]
    },
    profilePic: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;