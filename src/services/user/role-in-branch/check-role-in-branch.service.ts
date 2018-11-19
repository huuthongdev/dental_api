import { RoleInBranch, Role } from "../../../../src/refs";

export class CheckRoleInBranchService {
    static async check(userId: string, branchId: string, roleRequired: Role[]) {
        // Check admin
        const checkAdmin = await RoleInBranch.findOne({ user: userId, roles: { $eq: Role.ADMIN } });
        if (checkAdmin) return true;
        // Check Roles
        const userRolesInCurrentBranch = await RoleInBranch.findOne({ branch: branchId, user: userId }) as RoleInBranch; 
        if (!userRolesInCurrentBranch) return false;
        for (let i = 0; i < userRolesInCurrentBranch.roles.length; i++) {
            if (roleRequired.includes(userRolesInCurrentBranch.roles[i])) return true;
        }
        return false;
    }
}