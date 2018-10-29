import { User } from '../../refs';

export class ModifiedUserService {
    static async modified(userId: string, updateBy: string, dataBackup: User) {
        const data = JSON.stringify(dataBackup).toString();
        const updateAt = Date.now();
        return await User.findByIdAndUpdate(userId, { $addToSet: { modifieds: { updateAt, updateBy, dataBackup: data } } }, { new: true });
    }
}