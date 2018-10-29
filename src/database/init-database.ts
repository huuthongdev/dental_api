import faker from 'faker';
import { User } from '../../src/models/user.model';
import { ROOT_NAME, ROOT_EMAIL, ROOT_PHONE, DEFAULT_PASSWORD } from '../../src/refs';
import { hash } from 'bcryptjs';

export async function initDatabase() {
    const userCount = await User.count({});
    if (userCount !== 0) return;
    await createRootAccount();
}

export async function createRootAccount() {
    const password = await hash(DEFAULT_PASSWORD, 8);
    const user = new User({
        sid: 1,
        name: ROOT_NAME,
        email: ROOT_EMAIL,
        phone: ROOT_PHONE,
        password,
        birthday: new Date(1996, 11, 11).getTime(),
        // Address
        city: 'HCM',
        district: 'Phu Nhuan',
        address: '99 Nguyễn Văn Trỗi',
        homeTown: 'HA NOI',
    });
    await user.save();
}