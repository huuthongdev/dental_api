import { Role, RoleInBranchError, verifyLogInToken, User, mustExist, makeSure, UserError, BranchError, Branch, ServerError } from "../../../src/refs";
import { NextFunction, Request } from "express";

export function mustHaveRole(rolesCheck?: Role[]) {
    return async function (req: Request, res: any, next: NextFunction) {
        rolesCheck = rolesCheck ? rolesCheck : [];
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
            const roles = branchRoles && branchRoles.roles ? branchRoles.roles : [];
            // If Admin return next
            if (roles.find((v: string) => v === Role.ADMIN)) return next();
            // Check roles
            for (let i = 0; i < roles.length; i++) {
                if (rolesCheck.includes(roles[i])) {
                    req.query.roles = roles;
                    return next();
                };
            }
            throw new ServerError(RoleInBranchError.CANNOT_ACCESS, 400);
        } catch (error) {
            res.onError(error);
        }
    }
}