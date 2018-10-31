import { mustBeObjectId, User, UserError, mustExist, Branch, BranchError, RoleInBranch, Role } from "../../../../src/refs";

export class RemoveAllRoleInBranchService {
    static async validate(userId: string, branchId: string) {
        mustBeObjectId(userId, branchId);
        const user = await User.findById(userId);
        mustExist(user, UserError.CANNOT_FIND_USER);
        const branch = await Branch.findById(branchId);
        mustExist(branch, BranchError.CANNOT_FIND_BRANCH);
    }

    static async remove(userId: string, branchId: string) {
        await this.validate(userId, branchId);
        return await RoleInBranch.findOneAndRemove({ branch: branchId });
    }
}