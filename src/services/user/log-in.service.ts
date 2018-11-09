import { mustExist, makeSure, ServerError, User, UserError, GetUserInfo, validateEmail } from '../../refs';
import { compare } from 'bcryptjs';
import { createToken } from '../../../src/utils/jwt';

export class LoginService {

    static async login(loginInfo: string, password: string) {
        mustExist(loginInfo, UserError.LOGIN_INFO_BE_PROVIDED);
        mustExist(password, UserError.INVALID_LOG_IN_INFO);
        const checkEmail = validateEmail(loginInfo);
        if (checkEmail) return await this.loginWithEmail(loginInfo, password);
        return await this.loginWithPhone(loginInfo, password);
    }

    static async loginWithPhone(phone: string, password: string) {
        const user = await User.findOne({ phone }) as User;
        mustExist(user, UserError.INVALID_LOG_IN_INFO);
        const isMatch = await compare(password, user.password);
        makeSure(isMatch, UserError.INVALID_LOG_IN_INFO);
        return GetUserInfo.get(user._id, true);
    }

    static async loginWithEmail(email: string, password: string) {
        const user = await User.findOne({ email }) as User;
        mustExist(user, UserError.INVALID_LOG_IN_INFO);
        const isMatch = await compare(password, user.password);
        makeSure(isMatch, UserError.INVALID_LOG_IN_INFO);
        return GetUserInfo.get(user._id, true);
    }

    // static async getUserInfoWithToken(user: User) {
    //     const token = await createToken({ _id: user._id, version: user.passwordVersion });
    //     let userInfo = await GetUserInfo.get(user._id) as User;
    //     userInfo = userInfo.toObject();
    //     userInfo.token = token;
    //     return userInfo;
    // }
}