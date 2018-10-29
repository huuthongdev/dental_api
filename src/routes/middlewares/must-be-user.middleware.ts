import { Request, NextFunction } from 'express';
import { User, verifyLogInToken, mustExist } from '../../refs';

export async function mustBeUser(req: Request, res: any, next: NextFunction) {
    try {
        const { _id } = await verifyLogInToken(req.headers.token as string);
        const user = await User.findById(_id);
        mustExist(user, 'CANNOT_FIND_STAFF', 404);
        req.query.userId = _id;
        next();
    } catch (error) {
        res.onError(error);
    }
}
