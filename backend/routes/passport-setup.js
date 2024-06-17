import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://full-stack-chat-app-4amt.onrender.com/api/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        // Find or create the user in your database
        console.log("profile", profile);
        const { id, name, emails } = profile;
        const { givenName: firstName, familyName: lastName } = name;
        let user = await User.findOne({ googleId: id });

        if (!user) {
            const defaultProfilePic = `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}`;
            user = new User({
                googleId: id,
                firstName,
                lastName,
                username: firstName + lastName,
                gender: "unknown",
                email: emails[0].value,
                profilePic: defaultProfilePic
            });
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRETE, { expiresIn: '15d' });

        done(null, { user, token });
    }
));

// Serialize user into the session
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user, done) => {
    done(null, user);
});
