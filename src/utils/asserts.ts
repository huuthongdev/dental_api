import mongoose from 'mongoose';
import { ServerError } from '../refs';

export function makeSure(expression: boolean, message: string, statusCode = 400) {
    if (expression) return;
    throw new ServerError(message, statusCode);
}

export function mustExist(value: any, message: string, statusCode = 400) {
    if (value) return;
    throw new ServerError(message, statusCode);
}

export function mustMatchReg(value: string, reg: RegExp, message: string, statusCode = 400) {
    if (value.match(reg)) return;
    throw new ServerError(message, statusCode);
}

export function mustBeObjectId(...ids: any[]) {
    try {
        ids.forEach(_id => new mongoose.Types.ObjectId(_id.toString()));
    } catch (error) {
        throw new ServerError('INVALID_ID', 400);
    }
}
