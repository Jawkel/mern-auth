import mongoose from "mongoose";

export default mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    createdDate: {type: Date, default: Date.now},
    lastLogin: {type: Date, default: Date.now}
});