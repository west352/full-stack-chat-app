import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie, setCookieForOAuth } from "../utils/generateToken.js";

dotenv.config();

export const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, username, password, confirmPassword, gender } = req.body;

        if (password != confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //Default profile picture
        const defaultProfilePic = `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}`;

        const newUser = new User({
            firstName, lastName, username, email, password: hashedPassword, gender, profilePic: defaultProfilePic
        });
        generateTokenAndSetCookie(newUser._id, res);
        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            username: newUser.username,
            profilePic: newUser.profilePic
        });

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(400).json({ error: "Internal server error" });
    }
}

export const postOAuth = async (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Referrer-Policy", "no-referrer-when-downgrade");

    const redirectUrl = "http://127.0.0.1:8000/api/auth/oauth";
    const OAuthClient = new OAuth2Client(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        redirectUrl
    );
    const authorizeUrl = OAuthClient.generateAuthUrl({
        // to issue a refresh token
        access_type: "offline",
        scope: "https://www.googleapis.com/auth/userinfo.email profile openid",
        prompt: "consent"
    })

    res.json({ url: authorizeUrl });
}

export const getOAuth = async (req, res) => {
    const code = req.query.code;
    try {
        const redirectUrl = "http://127.0.0.1:8000/api/auth/oauth";
        const OAuthClient = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirectUrl
        );
        const r = await OAuthClient.getToken(code);
        await OAuthClient.setCredentials(r.tokens);

        const user = OAuthClient.credentials;
        const ticket = await OAuthClient.verifyIdToken({ idToken: user.id_token, audience: process.env.CLIENT_ID });
        const payload = ticket.getPayload();
        const { sub: googleId, given_name: firstName, family_name: lastName, email } = payload;

        const existingUser = await User.findOne({ googleId });
        if (existingUser) {
            generateTokenAndSetCookie(existingUser._id, res);
        } else {
            const defaultProfilePic = `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}`;

            const newUser = new User({
                firstName, lastName, username: firstName + lastName,
                googleId, email, gender: "unknown", profilePic: defaultProfilePic
            });
            setCookieForgenerateTokenAndSetCookieOAuth(newUser._id, res);
            await newUser.save();
        }

        console.log('Cookies: ', res._headers["set-cookie"]);
        //res.status(200).send();
        res.redirect(303, "http://localhost:5173");
    } catch (error) {
        console.log("Error logging in with Google OAuth2 user", error);
        res.status(400).json({ error: "Internal server error, please login with an account" });
    }
};

export const getUser = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const user = await User.findOne({ _id: loggedInUserId });
        console.log(user);
        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.log("error in getUser", error);
        res.status(400).json({ error: "Internal server error" });
    }
}