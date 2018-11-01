import { mustExist, User, makeSure, mustBeObjectId, UserError, validateEmail, RoleInBranch, SID_START_AT } from "../../refs";
import { hash } from 'bcryptjs';
export class CreateUserService {

    static async validate(userId: string, name: string, email: string, phone: string, password: string) {
        mustBeObjectId(userId);
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
        return;
    }

    static async create(userId: string, name: string, email: string, phone: string, password: string, birthday?: number, city?: string, district?: string, address?: string, homeTown?: string, roleInBranchs?: RoleInBranch[]) {
        await this.validate(userId, name, email, phone, password);
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
            // Role In Branch
            roleInBranchs,
            //  Create Related
            createBy: userId,
        });
        await user.save();
        const userRes = user.toObject();
        delete userRes.password;
        return userRes;
    }

    static async getSid() {
        const maxSid = await User.find({}).sort({ sid: -1 }).limit(1) as User[];
        if (maxSid.length === 0) return SID_START_AT;
        return maxSid[0].sid + 1;
    }
}