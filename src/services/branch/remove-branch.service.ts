import { mustBeObjectId, Branch, mustExist, BranchError, ModifiedService, makeSure, RoleInBranch, User } from "../../../src/refs";

export class RemoveBranchService {
    static async validate(userId: string, branchId: string, remove: boolean = false) {
        mustBeObjectId(userId, branchId);
        const oldBranch = await Branch.findById(branchId).select({ modifieds: false, __v: false, createAt: false, createBy: false }) as Branch;
        mustExist(oldBranch, BranchError.CANNOT_FIND_BRANCH);
        if (remove) makeSure(oldBranch.isMaster === false, BranchError.CANNOT_REMOVE_MASTER_BRANCH);
        return oldBranch as Branch;
    }

    static async disable(userId: string, branchId: string) {
        const oldBranch = await this.validate(userId, branchId);
        const newBranch = await Branch.findByIdAndUpdate(branchId, { isActive: false }, { new: true })
        ModifiedService.branch(branchId, userId, oldBranch);
        return newBranch;
    }

    static async enable(userId: string, branchId: string) {
        const oldBranch = await this.validate(userId, branchId);
        const newBranch = await Branch.findByIdAndUpdate(branchId, { isActive: true }, { new: true })
        ModifiedService.branch(branchId, userId, oldBranch);
        return newBranch;
    }

    static async remove(userId: string, branchId: string) {
        await this.validate(userId, branchId, true);
        // Remove All Roles In Branchs Related
        const branch = await Branch.findByIdAndRemove(branchId);
        await RoleInBranch.remove({ branch: branchId });
        await this.removeDataRelated(branchId);
        return branch;
    }

    static async removeDataRelated(branchId: string) {
        // Remove all User RoleInBranchs related
        const roleInBranchs = await RoleInBranch.find({ branch: branchId }) as RoleInBranch[];
        for (let i = 0; i < roleInBranchs.length; i++) {
            const user = await User.findById(roleInBranchs[i].user);
            await User.findByIdAndUpdate(user._id, { $pull: { roleInBranchs: roleInBranchs[i]._id } }, { new: true });
        }
    }
}