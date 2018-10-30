import { LoginService, ROOT_EMAIL, DEFAULT_PASSWORD, ROOT_PHONE, CreateBranchService } from "../src/refs";

export class InitDatabaseForTest {
    static async loginRootAccount() {
        return await LoginService.login(ROOT_PHONE, undefined, DEFAULT_PASSWORD);
    }

    static async createRootBranch() {
        const rootUser = await this.loginRootAccount();
        const masterBranch = await CreateBranchService.create(rootUser._id, 'Branch name', 'brand@gmail.com', '0909', 'HCM', 'Phu Nhuan', 'Address', true);
        const normalBranch = await CreateBranchService.create(rootUser._id, 'Branch name 2', 'brand2@gmail.com', '09092', 'HCM2', 'Phu Nhuan2', 'Address2', false);
        return { rootUser, masterBranch, normalBranch }
    }
}