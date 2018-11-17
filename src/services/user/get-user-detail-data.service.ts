import { User } from "../../../src/refs";

export class GetUserDetailDataService {
    static async get(userId: string) {
        const userInfo = await User.findById(userId).select({ password: false })
            .populate({
                path: 'roleInBranchs',
                select: { user: false },
                populate: {
                    path: 'branch',
                    select: 'sid name isMaster'
                }
            }) as User;
        let user = userInfo.toObject();
        user.detail = {};
        return user;
    }
}