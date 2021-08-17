import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const auth = async (req, res, next) => {
    try {
        const {cookies, headers} = req;

        /* Just checking if the refresh token is included */
        if (!cookies || !cookies.refresh_token) {
            return res.status(401).json({message: 'Missing token in cookie'});
        }

        /* Checking that access Token has been sent */
        if (!headers || !headers['access-token']) {
            return res.status(401).json({message: 'Missing access token in headers'});
        }
        const accessToken = headers['access-token'];

        /* We just need to decode the accessToken as the server trusts it */
        const decodedToken = jwt.verify(accessToken, process.env.SECRET_ACCESS);


        // Let's store our userId for further process
        req.userId = decodedToken.sub || decodedToken.userId;
        // All good
        return next();
    } catch (e) {
        console.log("Middleware error: %o", e);
        if (e.name === "TokenExpiredError") {
            return res.status(401).json({message: "accessToken expired", type: "AuthExpired"});
        } else if (e.name === "JsonWebTokenError") {
            return res.status(401).json({message: "Invalid Token", type: "InvalidToken"});
        }
        return res.status(500).json({message: 'Internal error'});
    }
};

export default auth;