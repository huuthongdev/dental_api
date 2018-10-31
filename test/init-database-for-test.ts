import { LoginService, ROOT_EMAIL, DEFAULT_PASSWORD, ROOT_PHONE, CreateBranchService, SetRoleInBranchService, Role } from "../src/refs";

export class InitDatabaseForTest {
    static async loginRootAccount() {
        return await LoginService.login(ROOT_PHONE, undefined, DEFAULT_PASSWORD);
    }

    static async createRootBranch() {
        const rootUser = await this.loginRootAccount();
        const masterBranch = await CreateBranchService.create(rootUser._id, 'Branch name', 'brand@gmail.com', '0909', 'HCM', 'Phu Nhuan', 'Address', true);
        await SetRoleInBranchService.set(rootUser._id, masterBranch._id, [Role.CHAIRMAN]);
        const normalBranch = await CreateBranchService.create(rootUser._id, 'Branch name 2', 'brand2@gmail.com', '09092', 'HCM2', 'Phu Nhuan2', 'Address2', false);
        return { rootUser, masterBranch, normalBranch }
    }
}