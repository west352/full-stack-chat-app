import express from "express";
import { signup, login, logout, postOAuth, getOAuth, getUser } from "../controllers/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/oauth", postOAuth);

router.get("/oauth", getOAuth);

router.get("/status", protectRoute, getUser);

export default router;