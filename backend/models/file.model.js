import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    size: {
        type: Number
    }
}, { timestamps: true });

const File = mongoose.model("File", fileSchema);

export default File;