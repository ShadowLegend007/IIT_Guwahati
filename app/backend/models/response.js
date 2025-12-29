import mongoose from "mongoose";

const dataSetImage = new mongoose.Schema({
    image: "String",
    heading: "String",
    category: "String",
    dataSource: "String",
    imageID: "String",
});

const datasetSchema = new mongoose.Schema({
    text: "String",
    heading: "String",
    category: "String",
    dataSource: "String",
    image: dataSetImage,
});

const responseSchema = new mongoose.Schema({
    responseID: {type: mongoose.Schema.Types.ObjectId, ref: "Response"},
    response: datasetSchema,

});

const Response = mongoose.model("Response", responseSchema);

export default Response;