import faker from 'faker';
import { User } from '../../src/models/user.model';
import { ROOT_NAME, ROOT_EMAIL, ROOT_PHONE, DEFAULT_PASSWORD, SID_START_AT, CreateBranchService, BRANCH_MASTER_NAME, SetRoleInBranchService, Role } from '../../src/refs';
import { hash } from 'bcryptjs';

export async function initDatabase() {
    const userCount = await User.count({});
    if (userCount !== 0) return;
    await prepareDataInit();
}

export async function prepareDataInit() {
    const password = await hash(DEFAULT_PASSWORD, 8);
    const user = new User({
        sid: SID_START_AT,
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
    const branchMaster = await CreateBranchService.create(user._id, BRANCH_MASTER_NAME, '', '', '', '', '', true);
    await SetRoleInBranchService.set(user._id, branchMaster._id, [Role.CHAIRMAN]);
}