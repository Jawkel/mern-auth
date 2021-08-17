import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ms from "ms";
import dotenv from "dotenv";
import UserRepository from "../Repositories/UserRepository.js";
import RefreshTokenRepository from "../Repositories/RefreshTokenRepository.js";

dotenv.config();

const userRepo = new UserRepository();
const tokenRepo = new RefreshTokenRepository();

export const login = (req, res) => {
    const {email, password} = req.body;
    const {refresh_token} = req.cookies;

    /* If email or password are missing, we send an error to the client */
    if (!email)
        return res.status(400).json({message: 'Email missing'});
    if (!password)
        return res.status(400).json({message: 'Password missing'});

    // User logged in while having a Refresh Token (shouldn't happen except during tests)
    if (refresh_token) {
        tokenRepo.findAndDelete({token: refresh_token}).then((token) => {
            res.cookie("refresh_token", "", {
                httpOnly: true,
                secure: false,
                maxAge: 0,
            });
        });
    }

    return userRepo.findUser({email}).then(async user => {

            // User not found
            if (!user) return res.status(401).json({message: "Invalid credentials."});

            return bcrypt.compare(password, user.password).then(async result => {
                // Password is wrong
                if (!result) return res.status(401).json({message: "Invalid credentials."});

                // update Last Login field
                user.lastLogin = Date.now();
                await userRepo.update(user);

                const {accessToken, refreshToken} = await generateTokens(user);

                // TODO: set secure to true on PRODUCTION
                res.cookie("refresh_token", refreshToken, {
                    httpOnly: true,
                    secure: false
                });

                // We don't want to send back any sensitive info
                user.password = undefined;

                return res.json({
                    accessToken,
                    user
                });
            });
        }
    ).catch(err => res.status(500).json({message: err}));
};

export const signup = async (req, res) => {
    const {email, password, firstname, lastname, confirmPassword} = req.body;

    /* If email or password are missing, we send an error to the client */
    if (!email)
        return res.status(400).json({message: 'Email missing'});
    if (!password)
        return res.status(400).json({message: 'Password missing'});

    let userEntity = {
        email: email,
        password: password,
        name: `${firstname} ${lastname}` || ""
    };

    /*==================
    ===== Verify that:
    ===== 1. User doesn't already exist
    ===== 2. Passwords match
    ===== 3. Tokens are generated
    ==================*/
    return userRepo.findUser({email: userEntity.email}).then(user => {
        if (user) return res.status(400).json({message: "User already exists."});
        if (userEntity.password !== confirmPassword) return res.status(400).json({message: "Passwords don't match."});
        userEntity.password = bcrypt.hashSync(confirmPassword, bcrypt.genSaltSync(11));
        userRepo.add(userEntity).then(async user => {
            const {accessToken, refreshToken} = await generateTokens(user);

            if (!accessToken || !refreshToken) return res.status(500).json({message: "Internal Server Error"});

            // Putting Refresh Token in httpOnly Cookie !!!TODO: set secure to true on PRODUCTION
            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: false
            });

            // We don't want to send back any sensitive info
            user.password = undefined;

            res.json({accessToken, user});
        }, err => {
            console.log(err);
            res.status(500).json({message: err});
        });
    }, err => res.status(500).json({message: err}));
};

export const logout = (req, res) => {
    const {refresh_token} = req.cookies;

    return tokenRepo
        .findAndDelete({token: refresh_token})
        .then((token) => {
            res.cookie("refresh_token", "", {
                httpOnly: true,
                secure: false,
                maxAge: 0,
            });
            return res.json({message: "Logout Successful"});
        })
        .catch((e) => console.log(e));
};

/*==================
===== Generate Access & Refresh Tokens
==================*/
const generateTokens = (user) => {
    const accessToken = jwt.sign({
        userId: user._id,
        email: user.email,
        name: user.name,
        date: Date.now()
    }, process.env.SECRET_ACCESS, {expiresIn: process.env.ACCESS_EXPIRES});

    const refreshToken = jwt.sign({
        userId: user._id,
        email: user.email,
        name: user.name,
        date: Date.now()
    }, process.env.SECRET_REFRESH, {expiresIn: process.env.REFRESH_EXPIRES});

    // Let's save the Refresh_Token in DB so we can revoke it if needed
    return tokenRepo.add({
        user: {userId: user._id.toString(), email: user.email, name: user.name},
        token: refreshToken,
        valid: true,
        expiresAt: Date.now() + ms(process.env.REFRESH_EXPIRES)
    }).then(token => {
        return {accessToken, refreshToken};
    }).catch(e => {
        return {};
    });
};

/*==================
===== We need to assess few things before sending back a new access Token
===== 1. Do we have a refreshToken in the httpSecure Cookie
===== 2. Is it our refreshToken (jwt verify)
===== 3. Is it expired ? (jwt verify)
===== 4. Does the user still exist?
==================*/
export const refreshToken = (req, res) => {
    const {refresh_token} = req.cookies;

    if (!refresh_token) return res.status(400).json({message: "Please authenticate."});

    try {
        let data = jwt.verify(refresh_token, process.env.SECRET_REFRESH);

        // Find Token and test if it has been revoked or if it has expired
        return tokenRepo.findToken({"user.userId": data.userId}).then((token) => {
            if (!token || !token.valid) {
                return tokenRepo
                    .findAndDelete({token: token.token})
                    .then((tokenDeleted) => res.status(401).json({message: `Token Invalid or Revoked`}));
            }
            // If not, let's send back an accessToken
            const accessToken = jwt.sign(
                {
                    userId: token.user.userId,
                    email: token.user.email,
                    name: token.user.name,
                    date: Date.now(),
                },
                process.env.SECRET_ACCESS,
                {expiresIn: process.env.ACCESS_EXPIRES}
            );
            return res.json({
                accessToken: accessToken,
                user: token.user,
            });
        });
    } catch (e) {
        console.log("%o", e);
        if (e.name === "TokenExpiredError") {
            tokenRepo
                .findAndDelete({token: refresh_token})
                .then((token) => {
                    if (!token.valid) throw new Error("Token Expired");
                })
                .catch((e) => console.log(e));
        }
        return res.status(400).json({message: "Please authenticate."});
    }
};