import { Request, NextFunction } from 'express';
import { User, verifyLogInToken, mustExist, makeSure, UserError, Branch, BranchError, RoleInBranch } from '../../refs';

export async function mustBeUser(req: Request, res: any, next: NextFunction) {
    try {
        // User
        const { _id, version } = await verifyLogInToken(req.headers.token as string);
        const user = await User.findById(_id).populate('roleInBranchs', 'branch roles') as User;
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
        // Role in branch
        let branchRoles = user.toObject().roleInBranchs.find((v: any) => v.branch.toString() === branchId.toString());
        req.query.roles = branchRoles.roles;
        // Next
        next();
    } catch (error) {
        res.onError(error);
    }
}
