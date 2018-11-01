import { LoginService, ROOT_EMAIL, DEFAULT_PASSWORD, ROOT_PHONE, CreateBranchService, SetRoleInBranchService, Role, CreateService, Branch, User, CreateProductService, CreateUserService } from "../src/refs";

export class InitDatabaseForTest {
    static async loginRootAccount() {
        const branchMaster = await Branch.findOne({ isMaster: true }) as Branch;
        const rootUser = await LoginService.login(ROOT_PHONE, undefined, DEFAULT_PASSWORD) as User;
        return { rootUser, branchMaster };
    }

    static async createNormalBranch() {
        const { rootUser, branchMaster } = await this.loginRootAccount();
        const normalBranch = await CreateBranchService.create(rootUser._id, 'Normal Branch', 'normalbranch@gmail.com', '0123', 'HCM', 'Phu Nhuan', 'Address') as Branch;
        return { rootUser, branchMaster, normalBranch };
    }

    static async createService() {
        const { rootUser, branchMaster, normalBranch } = await this.createNormalBranch();
        const service = await CreateService.create(rootUser._id, 'Service name', 100, ['Quy trinh'], []);
        return { rootUser, branchMaster, service, normalBranch }
    }

    static async createProduct() {
        const { rootUser, branchMaster, normalBranch } = await this.createNormalBranch();
        const product = await CreateProductService.create(rootUser._id, 'Product Name', 100, 'VN', 200);
        return { rootUser, branchMaster, normalBranch, product };
    }

    static async testGetAllUserInCurrentBranch() {
        const { rootUser, branchMaster, normalBranch } = await this.createNormalBranch();
        const user1 = await CreateUserService.create(rootUser._id, 'User 1', 'user1@gmail.com', '01', 'password');
        const user2 = await CreateUserService.create(rootUser._id, 'User 2', 'user2@gmail.com', '02', 'password');
        const user3 = await CreateUserService.create(rootUser._id, 'User 3', 'user3@gmail.com', '03', 'password');
        const user4 = await CreateUserService.create(rootUser._id, 'User 4', 'user4@gmail.com', '04', 'password');
        const user5 = await CreateUserService.create(rootUser._id, 'User 5', 'user5@gmail.com', '05', 'password');
        const user6 = await CreateUserService.create(rootUser._id, 'User 6', 'user6@gmail.com', '06', 'password');
        const user7 = await CreateUserService.create(rootUser._id, 'User 7', 'user7@gmail.com', '07', 'password');
        await SetRoleInBranchService.set(user1._id, normalBranch._id, [Role.CUSTOMER_CARE]);
        await SetRoleInBranchService.set(user2._id, normalBranch._id, [Role.DENTIST]);
        await SetRoleInBranchService.set(user3._id, normalBranch._id, [Role.DENTISTS_MANAGER]);
        await SetRoleInBranchService.set(user4._id, normalBranch._id, [Role.ACCOUNTANT]);
        await SetRoleInBranchService.set(user5._id, normalBranch._id, [Role.ACCOUNTANT]);
        await SetRoleInBranchService.set(user6._id, normalBranch._id, [Role.ACCOUNTING_MANAGER]);
        await SetRoleInBranchService.set(user7._id, normalBranch._id, [Role.DENTIST]);
        await CreateUserService.create(rootUser._id, 'Director', 'director@gmail.com', '08', 'password');
        const userDirect = await LoginService.login('08', undefined, 'password');
        await SetRoleInBranchService.set(userDirect._id, normalBranch._id, [Role.DIRECTOR]);
        // const check = await User.findById(userDirect._id);
        // console.log(check);
        return { rootUser, branchMaster, normalBranch, userDirect };
    }
}