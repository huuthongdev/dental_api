import { verifyLogInToken, User, mustExist, UserError, GetUserInfo } from "../../../src/refs";

export class CheckTokenUserService {
    static async check(token: string) {
        const obj = await verifyLogInToken(token);
        const { _id, version } = obj;
        const user = await User.findOne({ _id, passwordVersion: version }) as User;
        mustExist(user, UserError.USER_INFO_EXPIRED);
        return await GetUserInfo.get(user._id, true);
    }
}