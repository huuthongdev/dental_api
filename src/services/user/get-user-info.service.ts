import { User, createToken } from "../../../src/refs";

export class GetUserInfo {
    static async get(userId: string) {
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
        userInfo.token = token;
        return userInfo;
    }
}