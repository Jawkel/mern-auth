import express from "express";

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);
router.get('/refresh_token', refreshToken);
export default router;