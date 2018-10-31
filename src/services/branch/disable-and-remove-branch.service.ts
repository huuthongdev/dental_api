import { mustBeObjectId, Branch, mustExist, BranchError, ModifiedService } from "../../../src/refs";

export class DisableAndRemoveBranchService {
    static async validate(userId: string, brandId: string) {
        mustBeObjectId(userId, brandId);
        const oldBranch = await Branch.findById(brandId).select({ modifieds: false, __v: false, createAt: false, createBy: false });
        mustExist(oldBranch, BranchError.CANNOT_FIND_BRANCH);
        return oldBranch as Branch;
    }

    static async disable(userId: string, brandId: string) {
        const oldBranch = await this.validate(userId, brandId);
        const newBranch = await Branch.findByIdAndUpdate(brandId, { isActive: false }, { new: true })
        ModifiedService.branch(brandId, userId, oldBranch);
        return newBranch;
    }

    static async enable(userId: string, brandId: string) {
        const oldBranch = await this.validate(userId, brandId);
        const newBranch = await Branch.findByIdAndUpdate(brandId, { isActive: true }, { new: true })
        ModifiedService.branch(brandId, userId, oldBranch);
        return newBranch;
    }

    static async remove(userId: string, brandId: string) {
        await this.validate(userId, brandId);
        return await Branch.findByIdAndRemove(brandId);
    }
}