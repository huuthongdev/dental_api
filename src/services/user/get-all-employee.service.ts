import { User, RoleInBranch } from "../../../src/refs";

export class GetAllEmployeesService {
    static async getAll(userId: string, branchId: string) {
        let roleInBranchs = await RoleInBranch.find({ user: userId, branch: branchId });
        roleInBranchs = roleInBranchs.map(v => v._id);
        let users = await User.find({}).select({ password: false }).sort({ createAt: -1 }) as any[];
        users = users.map(v => v = v.toObject());
        for (let i = 0; i < users.length; i++) {
            let roleInBranchs = await RoleInBranch.find({ user: users[i]._id }).populate({ path: 'branch', select: 'sid name isMaster' })
            users[i].roleInBranchs = roleInBranchs;
        }
        return users;
    }

    static async getEmployeeInOneBranch(branchId: string) {
        return await RoleInBranch.find({ branch: branchId }).populate('user');
    }
}