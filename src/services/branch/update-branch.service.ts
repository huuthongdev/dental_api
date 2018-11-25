import { mustBeObjectId, BranchError, mustExist, Branch, makeSure, validateEmail, ModifiedService, modifiedSelect, convertToSave } from "../../../src/refs";

export interface UpdateBranchInput {
    name: string;
    email?: string;
    phone?: string;
    city?: string;
    district?: string;
    address?: string;
}
export class UpdateBranchService {

    static async validate(userId: string, branchId: string, updateBranchInput: UpdateBranchInput) {
        mustBeObjectId(userId, branchId);
        let { name, email, phone, city, district, address } = updateBranchInput;
        // Must Exist
        mustExist(name, BranchError.NAME_MUST_BE_PROVIDED);
        const oldBranch = await Branch.findById(branchId).select(modifiedSelect);
        mustExist(oldBranch, BranchError.CANNOT_FIND_BRANCH);
        // Make Sure
        const checkUniqueName = await Branch.count({ name, _id: { $ne: branchId } });
        makeSure(checkUniqueName === 0, BranchError.NAME_IS_EXISTED);
        // Check Email
        email = email ? email : undefined;
        if (email) {
            makeSure(validateEmail(email), BranchError.EMAIL_INCORRECT);
            const checkUniqueEmail = await Branch.count({ email, _id: { $ne: branchId } });
            makeSure(checkUniqueEmail === 0, BranchError.EMAIL_IS_EXISTED);
        }
        // Check Phone
        phone = phone ? phone : undefined;
        if (phone) {
            const checkUniquePhone = await Branch.count({ phone, _id: { $ne: branchId } });
            makeSure(checkUniquePhone === 0, BranchError.PHONE_IS_EXISTED);
        }
        return oldBranch;
    }

    static async update(userId: string, branchId: string, updateBranchInput: UpdateBranchInput) {
        const { name, email, phone, city, district, address } = updateBranchInput;
        const oldBranch = await this.validate(userId, branchId, updateBranchInput) as Branch;
        await Branch.findByIdAndUpdate(branchId, {
            name: convertToSave(name),
            email: convertToSave(email),
            phone: convertToSave(phone),
            city: convertToSave(city),
            district: convertToSave(district),
            address: convertToSave(address)
        }, { new: true });
        return await ModifiedService.branch(branchId, userId, oldBranch);
    }
}