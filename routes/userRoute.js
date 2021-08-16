import express from "express";
import {login, signup, logout, refreshToken} from "../Controllers/UserController.js";

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);
router.get('/refresh_token', refreshToken);
export default router;