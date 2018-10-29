import jwt from 'jsonwebtoken';
import { ServerError } from '../refs';
import { JWT_TOKEN_SECRET_KEY } from '../setting';

export function verifyLogInToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_TOKEN_SECRET_KEY, (err, obj: any) => {
            if (err) return reject(new ServerError('INVALID_TOKEN', 400));
            delete obj.iat;
            delete obj.exp;
            resolve(obj);
        });
    });
}

export function createToken(obj: object): Promise<string> {
    return new Promise((resolve, reject) => {
        jwt.sign(obj, JWT_TOKEN_SECRET_KEY, { expiresIn: '7 days' }, (err, token) => {
            if (err) return reject(err);
            resolve(token);
        });
    });
}
