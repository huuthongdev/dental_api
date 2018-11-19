import { mustBeObjectId, UserError, mustExist, validateEmail, makeSure, User, ModifiedService, modifiedSelect, GetUserInfo } from "../../../src/refs";

export interface UpdateProfileUserInput {
    name: string;
    email: string;
    phone: string;
    city?: string;
    district?: string;
    address?: string;
    homeTown?: string;
    birthday?: number;
}

export class UpdateProfileUserService {
    static async validate(userId: string, userUpdateId: string, updateProfileUserInput: UpdateProfileUserInput) {
        mustBeObjectId(userId, userUpdateId);
        const { name, email, phone } = updateProfileUserInput;
        // Find old data 
        const oldData = await User.findById(userUpdateId).select(modifiedSelect) as User;
        mustExist(oldData, UserError.CANNOT_FIND_USER);
        // Check Exist
        mustExist(name, UserError.NAME_MUST_BE_PROVIDED);
        mustExist(email, UserError.EMAIL_MUST_BE_PROVIDED);
        mustExist(phone, UserError.PHONE_MUST_BE_PROVIDED);
        // Validate
        makeSure(validateEmail(email), UserError.EMAIL_INCORRECT);
        // Check Unique
        const emailCount = await User.count({ email, _id: { $ne: userUpdateId } });
        makeSure(emailCount === 0, UserError.EMAIL_IS_EXISTED);
        const phoneCount = await User.count({ phone, _id: { $ne: userUpdateId } });
        makeSure(phoneCount === 0, UserError.PHONE_IS_EXISTED);
        return oldData;
    }

    static async update(userId: string, userUpdateId: string, updateProfileUserInput: UpdateProfileUserInput) {
        const oldData = await this.validate(userId, userUpdateId, updateProfileUserInput);
        let { name, email, phone, city, district, address, homeTown, birthday } = updateProfileUserInput;
        city = city ? city : null;
        district = district ? district : null;
        address = address ? address : null;
        homeTown = homeTown ? homeTown : null;
        birthday = birthday ? birthday : null;
        await User.findByIdAndUpdate(userUpdateId, { name, email, phone, city, district, address, birthday, homeTown }, { new: true });
        await ModifiedService.user(userUpdateId, userId, oldData);
        return await GetUserInfo.get(userId);
    }
}