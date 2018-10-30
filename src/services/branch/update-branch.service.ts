import { mustBeObjectId, BranchError, mustExist, Branch, makeSure, validateEmail, ModifiedService } from "../../../src/refs";

export class UpdateBranchService {

    static async validate(userId: string, branchId: string, name: string, email?: string, phone?: string, city?: string, district?: string, address?: string) {
        mustBeObjectId(userId, branchId);
        // Must Exist
        mustExist(name, BranchError.NAME_MUST_BE_PROVIDED);
        const oldBranch = await Branch.findById(branchId).select({ modifieds: false, __v: false, createAt: false, createBy: false });
        mustExist(oldBranch, BranchError.CANNOT_FIND_BRANCH);
        // Make Sure
        if (email) {
            makeSure(validateEmail(email), BranchError.EMAIL_INCORRECT);
            const checkUniqueEmail = await Branch.count({ email, _id: { $ne: branchId } });
            makeSure(checkUniqueEmail === 0, BranchError.EMAIL_IS_EXISTED);
        }
        if (phone) {
            const checkUniquePhone = await Branch.count({ phone, _id: { $ne: branchId } });
            makeSure(checkUniquePhone === 0, BranchError.PHONE_IS_EXISTED);
        }
        const checkUniqueName = await Branch.count({ name, _id: { $ne: branchId } });
        makeSure(checkUniqueName === 0, BranchError.NAME_IS_EXISTED);
        return oldBranch;
    }

    static async update(userId: string, branchId: string, name: string, email?: string, phone?: string, city?: string, district?: string, address?: string) {
        const oldBranch = await this.validate(userId, branchId, name, email, phone, city, district, address) as Branch;
        const branch = await Branch.findByIdAndUpdate(branchId, { name, email, phone, city, district, address }, { new: true });
        ModifiedService.branch(branchId, userId, oldBranch);
        return branch;
    }
}