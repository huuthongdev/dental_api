import { mustExist, makeSure, ServerError, User, UserError, GetUserInfo, validateEmail } from '../../refs';
import { compare } from 'bcryptjs';
import { createToken } from '../../../src/utils/jwt';

export class LoginService {

    static async login(phone: string, email: string, password: string) {
        mustExist(password, UserError.INVALID_LOG_IN_INFO);
        if (!phone && !email) throw new ServerError(UserError.INVALID_LOG_IN_INFO, 404);
        if (phone) return await this.loginWithPhone(phone, password);
        if (password) return await this.loginWithEmail(email, password);
    }

    static async loginWithPhone(phone: string, password: string) {
        const user = await User.findOne({ phone }) as User;
        mustExist(user, UserError.INVALID_LOG_IN_INFO);
        const isMatch = await compare(password, user.password);
        makeSure(isMatch, UserError.INVALID_LOG_IN_INFO);
        return this.getUserInfoWithToken(user);
    }

    static async loginWithEmail(email: string, password: string) {
        makeSure(validateEmail(email.toString().toLowerCase()), UserError.INVALID_LOG_IN_INFO);
        const user = await User.findOne({ email }) as User;
        mustExist(user, UserError.INVALID_LOG_IN_INFO);
        const isMatch = await compare(password, user.password);
        makeSure(isMatch, UserError.INVALID_LOG_IN_INFO);
        return this.getUserInfoWithToken(user);
    }

    static async getUserInfoWithToken(user: User) {
        const token = await createToken({ _id: user._id, version: user.passwordVersion });
        let userInfo = await GetUserInfo.get(user._id) as User;
        userInfo = userInfo.toObject();
        userInfo.token = token;
        return userInfo;
    }
}