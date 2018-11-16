"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const refs_1 = require("../refs");
const setting_1 = require("../setting");
function verifyLogInToken(token) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, setting_1.JWT_TOKEN_SECRET_KEY, (err, obj) => {
            if (err)
                return reject(new refs_1.ServerError('INVALID_TOKEN', 400));
            delete obj.iat;
            delete obj.exp;
            resolve(obj);
        });
    });
}
exports.verifyLogInToken = verifyLogInToken;
function createToken(obj) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign(obj, setting_1.JWT_TOKEN_SECRET_KEY, { expiresIn: '7 days' }, (err, token) => {
            if (err)
                return reject(err);
            resolve(token);
        });
    });
}
exports.createToken = createToken;
