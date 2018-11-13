import { RoleInBranch, User } from "../../../src/refs";

export class GetAllUSerInCurrentBranch {
    static async getAll(branchId: string) {
        const roleInBranchs = await RoleInBranch.find({ branch: branchId }).populate({
            path: 'user',
            select: { password: false, passwordVersion: false }
        }) as RoleInBranch[];
        return roleInBranchs;
    }
}