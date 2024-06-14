import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

import { s3Client } from "../aws/awsConfig.js";
import { PutObjectCommand, GetObjectAclCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { generateFileName } from "../utils/generateFileName.js";
import File from "../models/file.model.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, receiverId]
            })
        }

        let newMessage = new Message({
            senderId,
            receiverId,
            message
        });

        // if message is a file
        let fileSize;
        let fileUrl;
        const { name: fileName, type: fileType, data: fileData } = message;
        if (fileName && fileType && fileData) {
            let s3Name = generateFileName(fileType);
            const bufferData = Buffer.from(fileData.split(",")[1], 'base64');
            fileSize = bufferData.length;
            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Body: bufferData,
                Key: s3Name,
                ContentType: fileType
            }

            // send the file to S3
            await s3Client.send(new PutObjectCommand(uploadParams));

            const newFile = new File({
                s3Name,
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

            fileUrl = await getSignedUrl(s3Client, new GetObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: newFile.s3Name
            }), { expiresIn: 60 });
            console.log(fileUrl);
        }

        conversation.messages.push(newMessage._id);
        await Promise.all([newMessage.save(), conversation.save()]);

        // send the file url from s3 instead of the file id from database to the frontend
        if (newMessage.file) {
            newMessage = newMessage.toObject();
            newMessage.file = fileUrl;
        }

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

        let messages = conversation?.messages;
        messages = await Promise.all(messages.map(async (message) => {
            if (message.file) {
                message = message.toObject();
                const file = await File.findById(message.file._id);
                const s3Name = file.s3Name;
                const originalFileName = file.originalName;

                const fileUrl = await getSignedUrl(s3Client, new GetObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: s3Name
                }), { expiresIn: 600 });
                message.file = fileUrl;
                message.originalFileName = originalFileName;
            }
            return message;
        }));

        res.status(200).json(messages || []);
    } catch (error) {
        console.log("Error in getMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}