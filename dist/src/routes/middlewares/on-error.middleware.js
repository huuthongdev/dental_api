"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function onError(req, res, next) {
    res.onError = (error) => {
        // console.log(error);
        if (!error.statusCode)
            console.log(error);
        const body = { success: false, message: error.statusCode ? error.message : 'UNEXPECTED_ERROR' };
        res.status(error.statusCode || 500).send(body);
    };
    next();
}
exports.onError = onError;
