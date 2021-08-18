import express from "express";

const router = express.Router();

const testMiddlewareAuth = (req, res) => {
    return res.json({auth: "Successfully passed authMiddleware"});
};

router.get('/', testMiddlewareAuth);

export default router;