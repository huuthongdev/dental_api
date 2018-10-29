import { mustExist, makeSure, ServerError, User } from '../../refs';
import { compare } from 'bcryptjs';
import { validateEmail } from '../../../src/utils/validate';
import { createToken } from '../../../src/utils/jwt';

export class LoginService {
    static errors = { INVALID_LOG_IN_INFO: 'INVALID_LOG_IN_INFO' };

    static async login(phone: string, email: string, password: string) {
        mustExist(password, this.errors.INVALID_LOG_IN_INFO);
        if (!phone && !email) throw new ServerError(this.errors.INVALID_LOG_IN_INFO, 404);
        if (phone) return await this.loginWithPhone(phone, password);
        if (password) return await this.loginWithEmail(email, password);
    }

    static async loginWithPhone(phone: string, password: string) {
        const user = await User.findOne({ phone }) as User;
        mustExist(user, this.errors.INVALID_LOG_IN_INFO);
        const isMatch = await compare(password, user.password);
        makeSure(isMatch, this.errors.INVALID_LOG_IN_INFO);
        return await this.getUserInfo(user._id);
    }

    static async loginWithEmail(email: string, password: string) {
        makeSure(validateEmail(email.toString().toLowerCase()), this.errors.INVALID_LOG_IN_INFO);
        const user = await User.findOne({ email }) as User;
        mustExist(user, this.errors.INVALID_LOG_IN_INFO);
        const isMatch = await compare(password, user.password);
        makeSure(isMatch, this.errors.INVALID_LOG_IN_INFO);
        return await this.getUserInfo(user._id);
    }

    static async getUserInfo(userId: string) {
        const user = await User.findById(userId) as User;
        const token = await createToken({ _id: user._id, version: user.passwordVersion });
        const userRes = user.toObject() as User;
        userRes.token = token;
        return userRes;
    }
}