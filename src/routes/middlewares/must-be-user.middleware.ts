import { Request, NextFunction } from 'express';
import { User, verifyLogInToken, mustExist, makeSure, UserError, Branch, BranchError } from '../../refs';

export async function mustBeUser(req: Request, res: any, next: NextFunction) {
    try {
        // User
        const { _id, version } = await verifyLogInToken(req.headers.token as string);
        const user = await User.findById(_id) as User;
        mustExist(user, UserError.CANNOT_FIND_USER);
        makeSure(+version === +user.passwordVersion, UserError.INVALID_USER_INFO, 404);
        req.query.userId = _id;
        // Branch
        const branchId = req.headers.branch as string;
        mustExist(branchId, BranchError.BRANCH_ID_MUST_BE_PROVIDED);
        const branch = await Branch.findById(branchId) as Branch;
        mustExist(branch, BranchError.CANNOT_FIND_BRANCH);
        makeSure(branch.isActive, BranchError.BRANCH_IS_DISABLED);
        req.query.branchId = branchId;
        // Next
        next();
    } catch (error) {
        res.onError(error);
    }
}
