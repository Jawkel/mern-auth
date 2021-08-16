import mongoose from "mongoose";
import UserSchema from "./Schemas/UserSchema.js";

export default class User {
    constructor() {
        this.db = mongoose.model("User", UserSchema);
    }

    findUser(search = {}) {
        return new Promise((resolve, reject) => {
            this.db.findOne(search, function (err, user) {
                if (err) reject(err);
                resolve(user);
            });
        });
    }

    add(userEntity) {
        return new Promise((resolve, reject) => {
            this.db.create(userEntity, (err, user) => {
                if (err) {
                    reject(err);
                }
                resolve(user);
            });
        });
    }

    update(entity) {
        return new Promise((resolve, reject) => {
            this.db.findOneAndUpdate(
                {_id: entity._id},
                entity,
                {useFindAndModify: false},
                (err, doc) => {
                    if (err) reject(err);
                    resolve(doc);
                }
            );
        });
    }
}