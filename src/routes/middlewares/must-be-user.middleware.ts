import { Request, NextFunction } from 'express';
import { User, verifyLogInToken, mustExist, makeSure, UserError, RoleInBranch, Role } from '../../refs';

export async function mustBeUser(req: Request, res: any, next: NextFunction) {
    try {
        const { _id, version } = await verifyLogInToken(req.headers.token as string);
        const branchId = req.headers.branch as string;
        const user = await User.findById(_id) as User;
        mustExist(user, UserError.CANNOT_FIND_USER, 404);
        makeSure(+version === +user.passwordVersion, UserError.INVALID_USER_INFO, 404);
        req.query.userId = _id;
        req.query.branchId = branchId;
        mustExist(branchId, 'BRAND_ID_MUST_BE_PROVIDED');
        next();
    } catch (error) {
        res.onError(error);
    }
}

export async function mustBeChairman(req: Request, res: any, next: NextFunction) {
    try {
        const { _id, version } = await verifyLogInToken(req.headers.token as string);
        const branchId = req.headers.branch as string;
        const user = await User.findById(_id) as User;
        mustExist(user, UserError.CANNOT_FIND_USER, 404);
        makeSure(+version === +user.passwordVersion, UserError.INVALID_USER_INFO, 404);
        req.query.userId = _id;
        req.query.branchId = branchId;
        mustExist(branchId, 'BRAND_ID_MUST_BE_PROVIDED');
        // Check role chairman
        const roleInBranchs = await RoleInBranch.findOne({ user: user._id, roles: { $eq: Role.CHAIRMAN } });
        mustExist(roleInBranchs, UserError.PERMISSION_DENIED);
        next();
    } catch (error) {
        res.onError(error);
    }
}

export async function mustBeDirector(req: Request, res: any, next: NextFunction) {
    try {
        const { _id, version } = await verifyLogInToken(req.headers.token as string);
        const branchId = req.headers.branch as string;
        const user = await User.findById(_id) as User;
        mustExist(user, UserError.CANNOT_FIND_USER, 404);
        makeSure(+version === +user.passwordVersion, UserError.INVALID_USER_INFO, 404);
        req.query.userId = _id;
        req.query.branchId = branchId;
        mustExist(branchId, 'BRAND_ID_MUST_BE_PROVIDED');
        // Check role director
        const roleInBranchs = await RoleInBranch.findOne({ user: user._id, branch: branchId , roles: { $eq: Role.DIRECTOR } });
        mustExist(roleInBranchs, UserError.PERMISSION_DENIED);
        next();
    } catch (error) {
        res.onError(error);
    }
}
