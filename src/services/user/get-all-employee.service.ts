import { User, RoleInBranch } from "../../../src/refs";

export class GetAllEmployeesService {
    static async getAll(userId: string, branchId: string) {
        let roleInBranchs = await RoleInBranch.find({ user: userId, branch: branchId });
        roleInBranchs = roleInBranchs.map(v => v._id);
        return await User.find({}).populate({
            path: 'roleInBranchs',
            select: { user: false },
            populate: {
                path: 'branch',
                select: 'name sid'
            }
        }).select({ password: false });
    }

    static async getEmployeeInOneBranch(branchId: string) {
        return await RoleInBranch.find({ branch: branchId }).populate('user');
    }
}