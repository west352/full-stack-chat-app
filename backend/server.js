import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";
import passport from "passport";
import "./routes/passport-setup.js";


dotenv.config();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// to parse the incoming requests with JSON payloads (from req.body)
app.use(express.json({ limit: "10mb" }));
// to be able to access cookies from req.cookies
app.use(cookieParser());

app.use(passport.initialize());

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname, "frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`)
});
