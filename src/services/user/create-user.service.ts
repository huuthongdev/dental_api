import { mustExist, User, makeSure, mustBeObjectId, UserError, validateEmail, RoleInBranch, SID_START_AT, Branch, Role, RoleInBranchError, BranchError, SetRoleInBranchService, GetUserInfo } from "../../refs";
import { hash } from 'bcryptjs';

export interface CreateUserInput {
    name: string; 
    email: string; 
    phone: string; 
    password: string; 
    birthday?: number; 
    city?: string; 
    district?: string; 
    address?: string; 
    homeTown?: string; 
    branchWorkId?: string; 
    branchRole?: Role
}

export class CreateUserService {

    static async validate(userId: string, createUserInput: CreateUserInput) {
        mustBeObjectId(userId);
        const { name, email, phone, password, branchWorkId, branchRole } = createUserInput;
        // Check Exist
        mustExist(name, UserError.NAME_MUST_BE_PROVIDED);
        mustExist(email, UserError.EMAIL_MUST_BE_PROVIDED);
        mustExist(phone, UserError.PHONE_MUST_BE_PROVIDED);
        mustExist(password, UserError.PASSWORD_MUST_BE_PROVIDED);
        // Validate
        makeSure(validateEmail(email), UserError.EMAIL_INCORRECT);
        // Check Unique
        const emailCount = await User.count({ email });
        makeSure(emailCount === 0, UserError.EMAIL_IS_EXISTED);
        const phoneCount = await User.count({ phone });
        makeSure(phoneCount === 0, UserError.PHONE_IS_EXISTED);
        // Check Role
        if (branchWorkId && branchRole) {
            const { ACCOUNTANT, ACCOUNTING_MANAGER, ADMIN, DIRECTOR, CUSTOMER_CARE, CUSTOMER_CARE_MANAGER, X_RAY, DENTISTS_MANAGER, DENTIST } = Role;
            const rolesArr = [ACCOUNTANT, ACCOUNTING_MANAGER, ADMIN, DIRECTOR, CUSTOMER_CARE, CUSTOMER_CARE_MANAGER, X_RAY, DENTISTS_MANAGER, DENTIST];
            makeSure(rolesArr.includes(branchRole), RoleInBranchError.INVALID_ROLE);
            const branchWork = await Branch.findById(branchWorkId) as Branch;
            mustExist(branchWork, BranchError.CANNOT_FIND_BRANCH);
            return branchWork;
        }
        return true;
    }

    static async create(userId: string, createUserInput: CreateUserInput) {
        const branchWork = await this.validate(userId, createUserInput) as Branch;
        const { name, email, phone, birthday, password, city, district, address, homeTown, branchRole } = createUserInput;
        const hashed = await hash(password, 8);
        const sid = await this.getSid();
        const user = new User({
            sid,
            // Personal Information
            name,
            email,
            phone,
            birthday,
            password: hashed,
            // Address
            city,
            district,
            address,
            homeTown,
            //  Create Related
            createBy: userId,
        });
        await user.save();
        if (branchWork._id) return await SetRoleInBranchService.set(user._id, branchWork._id, [branchRole]);
        return await GetUserInfo.get(user._id);
    }

    static async getSid() {
        const maxSid = await User.find({}).sort({ sid: -1 }).limit(1) as User[];
        if (maxSid.length === 0) return SID_START_AT;
        return maxSid[0].sid + 1;
    }
}