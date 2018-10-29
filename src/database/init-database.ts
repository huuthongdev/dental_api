import faker from 'faker';
import { User } from '../../src/models/user.model';
import { ROOT_NAME, ROOT_EMAIL, ROOT_PHONE, DEFAULT_PASSWORD } from '../../src/refs';

export async function initDatabase() {
    const userCount = await User.count({});
    if (userCount !== 0) return;
    await createRootAccount();
}

export async function createRootAccount() {
    const user = new User({
        name: ROOT_NAME,
        email: ROOT_EMAIL,
        phone: ROOT_PHONE,
        password: DEFAULT_PASSWORD,
        birthday: new Date(1996, 11, 11).getTime(),
        // Address
        city: 'HCM',
        district: 'Phu Nhuan',
        address: '99 Nguyễn Văn Trỗi',
        homeTown: 'HA NOI',
        // Role In Branch
    });
    await user.save();
}