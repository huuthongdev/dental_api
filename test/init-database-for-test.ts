import { LoginService, ROOT_EMAIL, DEFAULT_PASSWORD, ROOT_PHONE, CreateBranchService, SetRoleInBranchService, Role, CreateService, Branch, User, CreateProductService, CreateUserService, Client, CreateClientService, Service, CreateTicketService } from "../src/refs";

export class InititalDatabaseForTest {
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

    static async createClient() {
        const { rootUser, branchMaster, normalBranch } = await this.createNormalBranch();
        const client = await CreateClientService.create(rootUser._id, 'Client', '0123', 'client@gmail.com', Date.now(), [], 'HCM', 'Phu Nhuan', '95/54 Huynh Van Banh', 'Phan Thiet');
        return { rootUser, branchMaster, normalBranch, client }
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

    static async testCreateTicket() {
        const { rootUser, branchMaster, normalBranch, client } = await this.createClient();
        const service1 = await CreateService.create(rootUser._id, 'Service 1', 100, [], []);
        const service2 = await CreateService.create(rootUser._id, 'Service 2', 200, [], []);
        const service3 = await CreateService.create(rootUser._id, 'Service 3', 300, [], []);
        const service4 = await CreateService.create(rootUser._id, 'Service 4', 400, [], []);
        const service5 = await CreateService.create(rootUser._id, 'Service 5', 500, [], []);
        const dentist = await CreateUserService.create(rootUser._id, 'Dentist', 'dentist@gmail.com', '0999999', 'password');
        await SetRoleInBranchService.set(dentist._id, normalBranch._id, [Role.DENTIST]);
        await CreateUserService.create(rootUser._id, 'Staff', 'staff@gmail.com', '222222', 'password');
        const staffCustomerCase = await LoginService.login(undefined, 'staff@gmail.com', 'password') as User;
        await SetRoleInBranchService.set(staffCustomerCase._id, normalBranch._id, [Role.CUSTOMER_CARE]);
        return { rootUser, branchMaster, normalBranch, client, services: [service1, service2, service3, service4, service5] as Service[], dentist, staffCustomerCase }
    }

    static async testUpdateTicket() {
        const { rootUser, branchMaster, normalBranch, client, services, dentist, staffCustomerCase } = await this.testCreateTicket();
        const dentist2 = await CreateUserService.create(rootUser._id, 'Dentist2', 'dentist2@gmail.com', '09999992', 'password');
        await SetRoleInBranchService.set(dentist2._id, normalBranch._id, [Role.DENTIST]);
        const items = [{
            service: services[0]._id,
            qty: 1
        }, {
            service: services[1]._id,
            qty: 2
        }];
        const ticket = await CreateTicketService.create(client._id, staffCustomerCase._id, dentist._id, normalBranch._id, items);
        return { ticket, rootUser, branchMaster, normalBranch, client, services, dentist, dentist2, staffCustomerCase }
    }

    static async testCheckRoleInBranch() {
        const { rootUser, branchMaster, normalBranch } = await this.createNormalBranch();
        const checkUser = await CreateUserService.create(rootUser._id, 'Normal', 'normal@gmail.com', '0999999', 'password');
        return { rootUser, branchMaster, normalBranch, checkUser }
    }

    static async testCreateCalendarDentist() {
        const { rootUser, branchMaster, normalBranch } = await this.createNormalBranch();
        const dentist = await CreateUserService.create(rootUser._id, 'Dentist', 'dentist@gmail.com', '0999999', 'password');
        await SetRoleInBranchService.set(dentist._id, normalBranch._id, [Role.DENTIST]);
        await CreateUserService.create(rootUser._id, 'Staff', 'staff@gmail.com', '0999999111', 'password');
        const staff = await LoginService.login(undefined, 'staff@gmail.com', 'password');
        await SetRoleInBranchService.set(staff._id, normalBranch._id, [Role.CUSTOMER_CARE]);
        return { rootUser, branchMaster, normalBranch, staff, dentist };
    }
}