import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { s3Client } from "../aws/awsConfig.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { generateFileName } from "../utils/generateFileName.js";
import File from "../models/file.model.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // if message is a file
        let fileSize;
        const { name: fileName, type: fileType, data: fileData } = message;
        if (fileName && fileType && fileData) {
            const bufferData = Buffer.from(fileData.split(",")[1], 'base64');
            fileSize = bufferData.length;
            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Body: bufferData,
                Key: generateFileName(fileType),
                ContentType: fileType
            }

            // send the file to S3
            await s3Client.send(new PutObjectCommand(uploadParams));
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, receiverId]
            })
        }

        let newMessage;
        if (fileName && fileType && fileData) {
            const newFile = new File({
                s3Name: generateFileName(fileType),
                originalName: fileName,
                type: fileType,
                size: fileSize
            });
            newMessage = new Message({
                senderId,
                receiverId,
                file: newFile._id
            });
            await newFile.save();
        } else {
            newMessage = new Message({
                senderId,
                receiverId,
                message
            });
        }

        console.log(newMessage);

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