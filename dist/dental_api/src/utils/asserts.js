"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const refs_1 = require("../refs");
function makeSure(expression, message, statusCode = 400) {
    if (expression)
        return;
    throw new refs_1.ServerError(message, statusCode);
}
exports.makeSure = makeSure;
function mustExist(value, message, statusCode = 400) {
    if (value)
        return;
    throw new refs_1.ServerError(message, statusCode);
}
exports.mustExist = mustExist;
function mustMatchReg(value, reg, message, statusCode = 400) {
    if (value.match(reg))
        return;
    throw new refs_1.ServerError(message, statusCode);
}
exports.mustMatchReg = mustMatchReg;
function mustBeObjectId(...ids) {
    try {
        ids.forEach(_id => new mongoose_1.default.Types.ObjectId(_id.toString()));
    }
    catch (error) {
        throw new refs_1.ServerError('INVALID_ID', 400);
    }
}
exports.mustBeObjectId = mustBeObjectId;
