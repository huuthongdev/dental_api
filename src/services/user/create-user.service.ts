import { mustExist, User, makeSure, mustBeObjectId } from "../../refs";
import { hash } from 'bcryptjs';
import { RoleInBranch } from "../../../src/models/role-in-branch.model";
import { validateEmail } from "../../../src/utils/validate";

export class CreateUserService {
    static errors = {
        // Must Exist
        NAME_MUST_BE_PROVIDED: 'NAME_MUST_BE_PROVIDED',
        EMAIL_MUST_BE_PROVIDED: 'EMAIL_MUST_BE_PROVIDED',
        PHONE_MUST_BE_PROVIDED: 'PHONE_MUST_BE_PROVIDED',
        PASSWORD_MUST_BE_PROVIDED: 'PASSWORD_MUST_BE_PROVIDED',
        // Unique
        EMAIL_IS_EXISTED: 'EMAIL_IS_EXISTED',
        PHONE_IS_EXISTED: 'PHONE_IS_EXISTED',
        // Validate
        EMAIL_INCORRECT: 'EMAIL_INCORRECT'
    }

    static async validate(userId: string, name: string, email: string, phone: string, password: string) {
        mustBeObjectId(userId);
        // Check Exist
        mustExist(name, this.errors.NAME_MUST_BE_PROVIDED);
        mustExist(email, this.errors.EMAIL_MUST_BE_PROVIDED);
        mustExist(phone, this.errors.PHONE_MUST_BE_PROVIDED);
        mustExist(password, this.errors.PASSWORD_MUST_BE_PROVIDED);
        // Validate
        makeSure(validateEmail(email), this.errors.EMAIL_INCORRECT);
        // Check Unique
        const emailCount = await User.count({ email });
        makeSure(emailCount === 0, this.errors.EMAIL_IS_EXISTED);
        const phoneCount = await User.count({ phone });
        makeSure(phoneCount === 0, this.errors.PHONE_IS_EXISTED);
        return;
    }

    static async create(userId: string, name: string, email: string, phone: string, password: string, birthday?: number, city?: string, district?: string, address?: string, homeTown?: string, roleInBranchs?: RoleInBranch[]) {
        await this.validate(userId, name, email, phone, password);
        const hashed = await hash(password, 8);
        const sid = await this.getUserSid();
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

    static async getUserSid() {
        const user = await User.count({});
        return user + 1;
    }
}