import mongoose from "mongoose";

const inputTextSchema = new mongoose.Schema({
    input: "String",
    lang: {type: "String", default: "en"},
});

const InputText = mongoose.model("InputText", inputTextSchema);

export default InputText;