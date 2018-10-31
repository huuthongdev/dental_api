import { Request, NextFunction } from 'express';
import { User, verifyLogInToken, mustExist, makeSure, UserError } from '../../refs';

export async function mustBeUser(req: Request, res: any, next: NextFunction) {
    try {
        const { _id, version } = await verifyLogInToken(req.headers.token as string);
        const user = await User.findById(_id) as User;
        mustExist(user, UserError.CANNOT_FIND_USER, 404);
        makeSure(+version === +user.passwordVersion, UserError.INVALID_USER_INFO, 404);
        req.query.userId = _id;
        next();
    } catch (error) {
        res.onError(error);
    }
}
