import { User } from "../../../src/refs";

export class GetUserInfo {
    static async get(userId: string) {
        return User.findById(userId).populate({
            path: 'roleInBranchs',
            select: { user: false },
            populate: {
                path: 'branch',
                select: 'name sid'
            }
        }).select({ password: false });
    }
}