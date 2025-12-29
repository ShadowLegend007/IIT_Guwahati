import mongoose from "mongoose";

const responseFeedbackSchema = new mongoose.Schema({
    responseID: {type: mongoose.Schema.Types.ObjectId, ref: "Response"},
    feedback: {type: "String", default: "good"},
});