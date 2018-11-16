"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServerError extends Error {
    constructor(msg, statusCode) {
        super(msg);
        if (statusCode)
            this.statusCode = statusCode;
    }
}
exports.ServerError = ServerError;
