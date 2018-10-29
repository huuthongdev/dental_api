import { mustBeObjectId, mustExist, Branch, makeSure, validateEmail } from "../../refs";

export class CreateBranchService {
    static errors = {
        // Must Exist
        NAME_MUST_BE_PROVIDED: 'NAME_MUST_BE_PROVIDED',
        NAME_IS_EXISTED: 'NAME_IS_EXISTED',
        EMAIL_IS_EXISTED: 'EMAIL_IS_EXISTED',
        PHONE_IS_EXISTED: 'PHONE_IS_EXISTED',
        ONLY_ONE_MASTER_BRANCH: 'ONLY_ONE_MASTER_BRANCH',
        // Validate
        EMAIL_INCORRECT: 'EMAIL_INCORRECT'
    }

    static async validate(userId: string, name: string, email?: string, phone?: string, city?: string, district?: string, address?: string, isMaster?: boolean) {
        mustBeObjectId(userId);
        // Must Exist
        mustExist(name, this.errors.NAME_MUST_BE_PROVIDED);
        // Make Sure
        if (isMaster) {
            const isMasterCheck = await Branch.count({ isMaster: true });
            makeSure(isMasterCheck === 0, this.errors.ONLY_ONE_MASTER_BRANCH);
        }
        if (email) {
            makeSure(validateEmail(email), this.errors.EMAIL_INCORRECT);
            const checkUniqueEmail = await Branch.count({ email: true });
            makeSure(checkUniqueEmail === 0, this.errors.EMAIL_IS_EXISTED);
        }
        if (phone) {
            const checkUniquePhone = await Branch.count({ phone: true });
            makeSure(checkUniquePhone === 0, this.errors.PHONE_IS_EXISTED);
        }
        const checkUniqueName = await Branch.count({ name });
        makeSure(checkUniqueName === 0, this.errors.NAME_IS_EXISTED);
    }

    static async getSid() {
        const branch = await Branch.count({});
        return branch + 1;
    }

    static async create(userId: string, name: string, email?: string, phone?: string, city?: string, district?: string, address?: string, isMaster?: boolean) {
        await this.validate(userId, name, email, phone, city, district, address, isMaster);
        email = email ? email : undefined;
        phone = phone ? phone : undefined;
        const sid = await this.getSid();
        const branch = new Branch({
            sid, name, email, phone, city, district, address, isMaster, createBy: userId
        });
        await branch.save();
        return branch;
    }
}