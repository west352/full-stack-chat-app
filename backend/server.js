import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";
import passport from "passport";
//import passportSetup from "./routes/passport-setup.js";
import "./routes/passport-setup.js";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT || 3000;

// to parse the incoming requests with JSON payloads (from req.body)
app.use(express.json({ limit: "10mb" }));
// to be able to access cookies from req.cookies
app.use(cookieParser());

app.use(passport.initialize());
//app.use(passport.session());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`)
});
