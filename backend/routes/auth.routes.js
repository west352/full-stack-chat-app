import express from "express";
import { signup, login, logout, verifyOAuth, oAuthCallback } from "../controllers/auth.controller.js";
import passport from "passport";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "failure",
    });
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: "consent" }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    oAuthCallback
);

router.get('/verify', verifyOAuth);

export default router;