import mongoose from "mongoose";

const inputImageSchema = new mongoose.Schema({
    image: "String",
    lang: {type: "String", default: "en"},
});

const InputImage = mongoose.model("InputImage", inputImageSchema);

export default InputImage;