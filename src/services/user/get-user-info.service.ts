import { User, createToken } from "../../../src/refs";

export class GetUserInfo {
    static async get(userId: string, getToken = false) {
        const user = await User.findById(userId).select({ password: false })
            .populate({
                path: 'roleInBranchs',
                select: { user: false },
                populate: {
                    path: 'branch',
                    select: 'sid name isMaster'
                }
            }) as User;
        let userInfo = user.toObject();
        delete userInfo.passwordVersion;
        if (!getToken) return userInfo;

        // Get Token
        const token = await createToken({ _id: user._id, version: user.passwordVersion });
        userInfo.token = token;
        return userInfo;
    }
}