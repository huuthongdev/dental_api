import { Request, NextFunction } from 'express';
import { User, verifyLogInToken, mustExist, makeSure } from '../../refs';

export async function mustBeUser(req: Request, res: any, next: NextFunction) {
    try {
        const { _id, version } = await verifyLogInToken(req.headers.token as string);
        const user = await User.findById(_id) as User;
        mustExist(user, 'CANNOT_FIND_STAFF', 404);
        makeSure(+version === +user.passwordVersion, 'INVALID_USER_INFO', 404);
        req.query.userId = _id;
        next();
    } catch (error) {
        res.onError(error);
    }
}
