import { mustBeObjectId, User, UserError, mustExist, Branch, BranchError, RoleInBranch, Role, makeSure, RoleInBranchError, GetUserInfo } from "../../../../src/refs";

export class SetRoleInBranchService {
    static async validate(userId: string, branchId: string, roles: Role[]) {
        mustBeObjectId(userId, branchId);
        const user = await User.findById(userId);
        mustExist(user, UserError.CANNOT_FIND_USER);
        const branch = await Branch.findById(branchId);
        mustExist(branch, BranchError.CANNOT_FIND_BRANCH);
        const roleInBranch = await RoleInBranch.findOne({ branch: branchId, user: userId });
        for (let i = 0; i < roles.length; i++) {
            const { ACCOUNTANT, ACCOUNTING_MANAGER, CHAIRMAN, DIRECTOR, CUSTOMER_CARE, CUSTOMER_CARE_MANAGER, X_RAY, DENTISTS_MANAGER, DENTIST } = Role;
            const rolesArr = [ACCOUNTANT, ACCOUNTING_MANAGER, CHAIRMAN, DIRECTOR, CUSTOMER_CARE, CUSTOMER_CARE_MANAGER, X_RAY, DENTISTS_MANAGER, DENTIST];
            makeSure(rolesArr.includes(roles[i]), RoleInBranchError.INVALID_ROLE);
        }
        return roleInBranch;
    }

    static async set(userId: string, branchId: string, roles: Role[]) {
        const roleInBranch = await this.validate(userId, branchId, roles);
        if (roleInBranch) return await this.updateRoleInCurrentBranch(roleInBranch._id, roles, userId);
        return await this.addNewRoleInBranch(branchId, roles, userId);
    }

    static async updateRoleInCurrentBranch(roleInBranchId: string, roles: Role[], userId: string) {
        await RoleInBranch.findByIdAndUpdate(roleInBranchId, { roles }, { new: true });
        return await GetUserInfo.get(userId);
    }

    static async addNewRoleInBranch(branchId: string, roles: Role[], userId: string) {
        const newRoleInBranch = new RoleInBranch({
            user: userId,
            branch: branchId,
            roles
        });
        await newRoleInBranch.save();
        const user = await User.findByIdAndUpdate(userId, { $addToSet: { roleInBranchs: newRoleInBranch._id } }, { new: true });
        return await GetUserInfo.get(user._id);
    }
}