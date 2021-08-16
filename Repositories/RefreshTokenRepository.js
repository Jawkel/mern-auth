import mongoose from "mongoose";

import RefreshTokenSchema from "./Schemas/RefreshTokenSchema.js";

export default class RefreshToken {
    constructor() {
        this.db = mongoose.model("RefreshToken", RefreshTokenSchema);
    }

    findToken(search = {}) {
        return new Promise((resolve, reject) => {
            this.db.findOne(search, function (err, user) {
                if (err) reject(err);
                resolve(user);
            });
        });
    }

    add(refreshToken) {
        return new Promise((resolve, reject) => {
            this.db.create(refreshToken, (err, token) => {
                if (err) {
                    reject(err);
                }
                resolve(token);
            });
        });
    }

    findAndDelete(search = {}) {
        return new Promise((resolve, reject) => {
            this.db.findOneAndDelete(search, function (err, user) {
                if (err) reject(err);
                resolve(user);
            });
        });
    }
}