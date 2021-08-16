import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ms from "ms";
import dotenv from "dotenv";
import UserRepository from "../Repositories/UserRepository.js";
import RefreshTokenRepository from "../Repositories/RefreshTokenRepository.js";

dotenv.config();

const userRepo = new UserRepository();
const tokenRepo = new RefreshTokenRepository();


export const refreshToken = (req, res) => {
};

export const login = (req, res) => {
    const {email, password} = req.body;

    /* If email or password are missing, we send an error to the client */
    if (!email)
        return res.status(400).json({message: 'Email missing'});
    if (!password)
        return res.status(400).json({message: 'Password missing'});

    return res.json({message: "login POST route"});
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

    return userRepo.findUser({email: userEntity.email}).then(user => {
        if (user) return res.status(400).json({message: "User already exists."});
        if (userEntity.password !== confirmPassword) return res.status(400).json({message: "Passwords don't match."});
        userEntity.password = bcrypt.hashSync(confirmPassword, bcrypt.genSaltSync(11));
        console.log("UserEntity:", userEntity);
        userRepo.add(userEntity).then(async user => {
            const {accessToken, refreshToken} = await generateTokens(user);

            if (!accessToken || !refreshToken) return res.status(500).json({message: "Internal Server Error"});

            // Putting Refresh Token in httpOnly Cookie
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
};

const generateTokens = async (user) => {
    const accessToken = await jwt.sign({
        userId: user._id,
        email: user.email,
        name: user.name,
        date: Date.now()
    }, process.env.SECRET_ACCESS, {expiresIn: process.env.ACCESS_EXPIRES});

    const refreshToken = await jwt.sign({
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