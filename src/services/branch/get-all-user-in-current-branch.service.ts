import { RoleInBranch, User } from "../../../src/refs";

export class GetAllUSerInCurrentBranch {
    static async getAll(branchId: string) {
        const roleInBranchs = await RoleInBranch.find({ branch: branchId }) as RoleInBranch[];
        const roleArr = roleInBranchs.map(v => v.user) as string[];
        const userInCurrentBranch = await User.find({ _id: { $in: roleArr } }).populate({
            path: 'roleInBranchs'
        }).select({ password: false });
        return userInCurrentBranch;
    }
}