import { mustBeObjectId, mustExist, Branch, makeSure, validateEmail, BranchError, SID_START_AT } from "../../refs";

export class CreateBranchService { 

    static async validate(userId: string, name: string, email?: string, phone?: string, city?: string, district?: string, address?: string, isMaster?: boolean) {
        mustBeObjectId(userId);
        // Must Exist
        mustExist(name, BranchError.NAME_MUST_BE_PROVIDED);
        // Make Sure
        if (isMaster) {
            const isMasterCheck = await Branch.count({ isMaster: true });
            makeSure(isMasterCheck === 0, BranchError.ONLY_ONE_MASTER_BRANCH);
        }
        if (email) {
            makeSure(validateEmail(email), BranchError.EMAIL_INCORRECT);
            const checkUniqueEmail = await Branch.count({ email });
            makeSure(checkUniqueEmail === 0, BranchError.EMAIL_IS_EXISTED);
        }
        if (phone) {
            const checkUniquePhone = await Branch.count({ phone });
            makeSure(checkUniquePhone === 0, BranchError.PHONE_IS_EXISTED);
        }
        const checkUniqueName = await Branch.count({ name });
        makeSure(checkUniqueName === 0, BranchError.NAME_IS_EXISTED);
    }
 
    static async getSid() {
        const maxSid = await Branch.find({}).sort({ sid: -1 }).limit(1) as Branch[];
        if (maxSid.length === 0) return SID_START_AT;
        return maxSid[0].sid + 1;
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