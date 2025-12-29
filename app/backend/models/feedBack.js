import mongoose from "mongoose";

const feedBackSchema = new mongoose.Schema({
    name: "String",
    email: {type: "String", unique: true},
    message: "String",
    rating: {type: "Number", min: 1, max: 5},
    date: {type: Date, default: Date.now},
});