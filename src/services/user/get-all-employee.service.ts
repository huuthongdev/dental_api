import { User, RoleInBranch, CheckMasterBranchService, Role, CheckRoleInBranchService } from "../../../src/refs";

export class GetAllEmployeesService {
    static async getAll(userId: string, branchId: string, userRoles: Role[]) {
        const checkMaster = await CheckMasterBranchService.check(branchId);
        // const checkUserDirector = await CheckRoleInBranchService.check(userId, branchId, [Role.DIRECTOR]);
        if (checkMaster) {
            const users = await User.find({}).populate({
                path: 'roleInBranchs',
                select: { user: false },
                populate: {
                    path: 'branch',
                    select: 'sid name isMaster'
                }
            })
            return users;
        }
        let roleInBranchs = await RoleInBranch.find({ branch: branchId }).populate('user').populate('branch', 'name sid') as any;
        const users = roleInBranchs.map((v: any) => v = { ...v.toObject().user, roleInBranchs: [{ roles: v.toObject().roles, branch: v.toObject().branch }] });
        return users;
    }

    static async getEmployeeInOneBranch(branchId: string) {
        return await RoleInBranch.find({ branch: branchId }).populate('user');
    }

    static async getFullForCreateEmployee() {
        const users = await User.find({}).populate({
            path: 'roleInBranchs',
            select: { user: false },
            populate: {
                path: 'branch',
                select: 'sid name isMaster'
            }
        })
        return users;
    }
}