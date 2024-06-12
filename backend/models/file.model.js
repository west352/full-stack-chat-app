import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    // name uploaded to s3 bucket
    s3Name: {
        type: String,
        unique: true,
        required: true
    },
    originalName: {
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