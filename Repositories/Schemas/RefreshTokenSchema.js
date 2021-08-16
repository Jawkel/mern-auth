import mongoose from "mongoose";

export default mongoose.Schema({
    user: {type: Object, required: true},
    token: {type: String, required: true, unique: true},
    valid: {type: Boolean, required: true},
    expiresAt: {type: Date, required: true},
});