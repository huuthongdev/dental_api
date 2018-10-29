import { hash, compare } from "bcryptjs";
import { mustExist, makeSure, User, ModifiedUserService } from "../../../src/refs";

export class ChangePasswordService {
    static errors = {
        OLD_PASSWORD_MUST_BE_PROVIDED: 'OLD_PASSWORD_MUST_BE_PROVIDED',
        NEW_PASSWORD_MUST_BE_PROVIDED: 'NEW_PASSWORD_MUST_BE_PROVIDED',
        OLD_PASSWORD_INCORRECT: 'OLD_PASSWORD_INCORRECT'
    }

    static async validate(userId: string, oldPassword: string, newPassword: string) {
        // Must Exist
        mustExist(oldPassword, this.errors.OLD_PASSWORD_MUST_BE_PROVIDED);
        mustExist(newPassword, this.errors.NEW_PASSWORD_MUST_BE_PROVIDED);
        // Make Sure
        const user = await User.findById(userId) as User;
        const isMatch = await compare(oldPassword, user.password);
        makeSure(isMatch, this.errors.OLD_PASSWORD_INCORRECT);
        return user as User;
    }

    static async change(userId: string, oldPassword: string, newPassword: string) {
        const userOld = await this.validate(userId, oldPassword, newPassword);
        const passwordVersion = userOld.passwordVersion + 1;
        const hashed = await hash(newPassword, 8);
        const user = await User.findByIdAndUpdate(userId, { password: hashed, passwordVersion }, { new: true });
        ModifiedUserService.modified(userId, userId, userOld);
        const userRes = user.toObject();
        delete userRes.password;
        return userRes;
    }
}