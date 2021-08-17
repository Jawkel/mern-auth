import express from "express";

const router = express.Router();

const testMiddlewareAuth = (req, res) => {
    return res.json({auth: "Successful"});
};

router.get('/', testMiddlewareAuth);

export default router;