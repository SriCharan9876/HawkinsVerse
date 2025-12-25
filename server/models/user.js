import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    isVerified: { type: Boolean, default: false },
    googleId: { type: String, unique: true, sparse: true }
});

export default mongoose.model("User", userSchema);