import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // if message is a file
        const { name: fileName, type: fileType, data: fileData } = message;
        if (fileName) {
            const currentDir = __dirname;
            const parentDir = path.resolve(currentDir, "..");
            const filePath = parentDir + "/uploads/" + fileName;
            const bufferData = Buffer.from(fileData.split(",")[1], 'base64');
            fs.writeFile(filePath, bufferData, (error) => {
                if (error) {
                    throw new Error(error);
                } else {
                    console.log("file saved" + filePath);
                }
            });

            throw new Error("test");
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, receiverId]
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        });
        conversation.messages.push(newMessage._id);
        await Promise.all([newMessage.save(), conversation.save()]);

        //SocketIo functionality
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            // io.to(<socket_id>).emit() used to send events to specific client
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, id] }
        }).populate("messages"); // not references but actual message documents

        res.status(200).json(conversation?.messages || []);
    } catch (error) {
        console.log("Error in getMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}