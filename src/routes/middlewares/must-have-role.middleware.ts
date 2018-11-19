import { Role, CheckRoleInBranchService, RoleInBranchError } from "../../../src/refs";
import { NextFunction, Request } from "express";

export function mustHaveRole(roles?: Role[]) {
    return async function (req: Request, res: any, next: NextFunction) {
        roles = roles ? roles : [];
        const userId = req.query.userId;
        const branchId = req.query.branchId;
        const check = await CheckRoleInBranchService.check(userId, branchId, roles);
        if (check) return next();
        return res.status(400).send({ success: false, message: RoleInBranchError.INVALID_ROLE });
    }
}