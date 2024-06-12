import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String
    },
    file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File"
    }
}, { timestamps: true });

// validation function to ensure that either message of file field is present
messageSchema.path('message').validate(function (value) {
    return value || this.file;
}, 'Either message or file field is required.');

const Message = mongoose.model("Message", messageSchema);

export default Message;