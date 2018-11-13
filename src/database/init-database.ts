import faker from 'faker';
import { User } from '../../src/models/user.model';
import { ROOT_NAME, ROOT_EMAIL, ROOT_PHONE, DEFAULT_PASSWORD, SID_START_AT, BRANCH_MASTER_NAME, SetRoleInBranchService, Role, Branch, CreateBranchService } from '../../src/refs';
import { hash } from 'bcryptjs';

export async function initDatabase() {
    const userCount = await User.count({});
    if (userCount !== 0) return;
    await prepareDataInit();
}

export async function prepareDataInit() {
    const rootUser = await createRootUser();
    await createBranchMaster(rootUser._id);
    // TODO: TEST FRONT_END
    // const branch2 = await CreateBranchService.create(rootUser._id, 'CN GO VAP', 'govap@gmail.com', '09999', 'HCM', 'GO VAP');
    // await SetRoleInBranchService.set(rootUser._id, branch2._id, [Role.DIRECTOR]);
}

export async function createRootUser() {
    const password = await hash(DEFAULT_PASSWORD, 8);
    const user = new User({
        sid: SID_START_AT,
        name: ROOT_NAME,
        email: ROOT_EMAIL,
        phone: ROOT_PHONE,
        password,
    });
    return await user.save();
}

export async function createBranchMaster(rootUserId: string) {
    const branchMaster = new Branch({
        sid: SID_START_AT,
        name: BRANCH_MASTER_NAME,
        isMaster: true,
        createBy: rootUserId
    });
    await branchMaster.save();
    return await SetRoleInBranchService.set(rootUserId, branchMaster._id, [Role.ADMIN, Role.DIRECTOR]);
}