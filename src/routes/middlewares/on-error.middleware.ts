import { Request, NextFunction } from 'express';
import { ServerError } from '../../refs';

export function onError(req: Request, res: any, next: NextFunction) {
    res.onError = (error: ServerError) => {
        // console.log(error);
        if (!error.statusCode) console.log(error);
        const body = { success: false, message: error.statusCode ? error.message : 'UNEXPECTED_ERROR' };
        res.status(error.statusCode || 500).send(body);
    }
    next();
}
