import { User, createToken } from "../../../src/refs";

export class GetUserInfo {
    static async get(userId: string, getToken = false) {
        const user = await User.findById(userId).populate({
            path: 'roleInBranchs',
            select: { user: false },
            populate: {
                path: 'branch',
                select: 'name sid isMaster'
            }
        }).select({ password: false }) as User;
        const token = await createToken({ _id: user._id, version: user.passwordVersion });
        let userInfo = user.toObject();
        delete userInfo.passwordVersion;
        if (!getToken) return userInfo;
        userInfo.token = token;
        return userInfo;
    }
}