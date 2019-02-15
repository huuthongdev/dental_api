import { User, mustExist, UserError, MailService, ServerError } from "../../../../src/refs";
import { hash } from "bcryptjs";

export class ForgotPasswordService {
    static async suggest(email: string) {
        try {
            const checkUser = await User.findOne({ email }) as User;
            mustExist(checkUser, UserError.CANNOT_FIND_USER);
            let changePasswordPIN: any = Math.ceil((Math.random()) * 1000000);
            if (changePasswordPIN.toString().length === 5) changePasswordPIN = changePasswordPIN * 10;
            await User.findByIdAndUpdate(checkUser._id, { changePasswordPIN }, { new: true });
            MailService.send(checkUser.email, 'Mã PIN thay đổi mật khẩu', `<h1>${changePasswordPIN}</h1>`);
            setTimeout(async () => {
                await User.findByIdAndUpdate(checkUser._id, { changePasswordPIN: null });
            }, 1000 * 60 * 10);
            return true;
        } catch (error) {
            throw new ServerError(error.message, 400);
        }
    }

    static async changePasswordWithPIN(pin: number, newPassword: string) {
        mustExist(pin, 'Mã PIN cần được cung cấp');
        const checkUser = await User.findOne({ changePasswordPIN: +pin }) as User;
        mustExist(checkUser, 'Mã PIN không hợp lệ!');
        const hashed = await hash(newPassword, 8);
        return await User.findByIdAndUpdate(checkUser._id, { password: hashed, passwordVersion: checkUser.passwordVersion + 1 }, { new: true });
    }

    static async validatePIN(pin: number) {
        mustExist(pin, 'Mã PIN cần được cung cấp');
        const checkUser = await User.findOne({ changePasswordPIN: +pin }) as User;
        mustExist(checkUser, 'Mã PIN không hợp lệ!');
        return true;
    }
}