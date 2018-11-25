import { mustBeObjectId, mustExist, Branch, makeSure, validateEmail, BranchError, SID_START_AT, convertToSave } from "../../refs";

export interface CreateBranchInput {
    name: string;
    email?: string;
    phone?: string;
    city?: string;
    district?: string;
    address?: string;
}

export class CreateBranchService {

    static async validate(userId: string, createBranchInput: CreateBranchInput, isMaster?: boolean) {
        let { name, email, phone, city, district, address } = createBranchInput;
        mustBeObjectId(userId);
        // Must Exist
        mustExist(name, BranchError.NAME_MUST_BE_PROVIDED);
        // Make Sure
        if (isMaster) {
            const isMasterCheck = await Branch.count({ isMaster: true });
            makeSure(isMasterCheck === 0, BranchError.ONLY_ONE_MASTER_BRANCH);
        }

        email = convertToSave(email);
        if (email) {
            makeSure(validateEmail(email), BranchError.EMAIL_INCORRECT);
            const checkUniqueEmail = await Branch.count({ email });
            makeSure(checkUniqueEmail === 0, BranchError.EMAIL_IS_EXISTED);
        }

        phone = convertToSave(phone);
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

    static async create(userId: string, createBranchInput: CreateBranchInput, isMaster?: boolean) {
        const { name, email, phone, city, district, address } = createBranchInput;
        await this.validate(userId, createBranchInput, isMaster);
        const sid = await this.getSid();
        const branch = new Branch({
            sid,
            name: convertToSave(name),
            email: convertToSave(email),
            phone: convertToSave(phone),
            city: convertToSave(city),
            district: convertToSave(district),
            address: convertToSave(address),
            isMaster,
            createBy: userId
        });
        await branch.save();
        return branch;
    }
}