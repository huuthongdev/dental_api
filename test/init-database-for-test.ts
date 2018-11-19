import { LoginService, ROOT_EMAIL, DEFAULT_PASSWORD, ROOT_PHONE, CreateBranchService, SetRoleInBranchService, Role, CreateService, Branch, User, CreateProductService, CreateUserService, Client, CreateClientService, Service, CreateTicketService } from "../src/refs";

export class InititalDatabaseForTest {
    static async loginRootAccount() {
        const branchMaster = await Branch.findOne({ isMaster: true }) as Branch;
        const rootUser = await LoginService.login(ROOT_PHONE, DEFAULT_PASSWORD) as User;
        return { rootUser, branchMaster };
    }

    static async createNormalBranch() {
        const { rootUser, branchMaster } = await this.loginRootAccount();
        const normalBranch = await CreateBranchService.create(rootUser._id, 'Normal Branch', 'normalbranch@gmail.com', '0123', 'HCM', 'Phu Nhuan', 'Address') as Branch;
        return { rootUser, branchMaster, normalBranch };
    }

    static async createService() {
        const { rootUser, branchMaster, normalBranch } = await this.createNormalBranch();
        const service = await CreateService.create(rootUser._id, 'Service name', 100, ['Quy trinh'], [], 'Unit', 200);
        return { rootUser, branchMaster, service, normalBranch }
    }

    static async createProduct() {
        const { rootUser, branchMaster, normalBranch } = await this.createNormalBranch();
        const product = await CreateProductService.create(rootUser._id, 'Product Name', 100, 'VN', 'Unit', 200);
        return { rootUser, branchMaster, normalBranch, product };
    }

    static async createClient() {
        const { rootUser, branchMaster, normalBranch } = await this.createNormalBranch();
        const client = await CreateClientService.create(rootUser._id, 'Client', '0123', 'client@gmail.com', Date.now(), [], 'HCM', 'Phu Nhuan', '95/54 Huynh Van Banh', 'Phan Thiet');
        return { rootUser, branchMaster, normalBranch, client }
    }

    static async testGetAllUserInCurrentBranch() {
        const { rootUser, branchMaster, normalBranch } = await this.createNormalBranch();
        const user1 = await CreateUserService.create(rootUser._id, { name: 'User 1', email: 'user1@gmail.com', phone: '01', password: 'password' });
        const user2 = await CreateUserService.create(rootUser._id, { name: 'User 2', email: 'user2@gmail.com', phone: '02', password: 'password' });
        const user3 = await CreateUserService.create(rootUser._id, { name: 'User 3', email: 'user3@gmail.com', phone: '03', password: 'password' });
        const user4 = await CreateUserService.create(rootUser._id, { name: 'User 4', email: 'user4@gmail.com', phone: '04', password: 'password' });
        const user5 = await CreateUserService.create(rootUser._id, { name: 'User 5', email: 'user5@gmail.com', phone: '05', password: 'password' });
        const user6 = await CreateUserService.create(rootUser._id, { name: 'User 6', email: 'user6@gmail.com', phone: '06', password: 'password' });
        const user7 = await CreateUserService.create(rootUser._id, { name: 'User 7', email: 'user7@gmail.com', phone: '07', password: 'password' });
        await SetRoleInBranchService.set(user1._id, normalBranch._id, [Role.CUSTOMER_CARE]);
        await SetRoleInBranchService.set(user2._id, normalBranch._id, [Role.DENTIST]);
        await SetRoleInBranchService.set(user3._id, normalBranch._id, [Role.DENTISTS_MANAGER]);
        await SetRoleInBranchService.set(user4._id, normalBranch._id, [Role.ACCOUNTANT]);
        await SetRoleInBranchService.set(user5._id, normalBranch._id, [Role.ACCOUNTANT]);
        await SetRoleInBranchService.set(user6._id, normalBranch._id, [Role.ACCOUNTING_MANAGER]);
        await SetRoleInBranchService.set(user7._id, normalBranch._id, [Role.DENTIST]);
        await CreateUserService.create(rootUser._id, { name: 'Director', email: 'director@gmail.com', phone: '08', password: 'password' });
        const userDirect = await LoginService.login('08', 'password');
        await SetRoleInBranchService.set(userDirect._id, normalBranch._id, [Role.DIRECTOR]);
        return { rootUser, branchMaster, normalBranch, userDirect };
    }

    static async testCreateTicket() {
        const { rootUser, branchMaster, normalBranch, client } = await this.createClient();
        const service1 = await CreateService.create(rootUser._id, 'Service 1', 100, [], [], 'Unit', 100);
        const service2 = await CreateService.create(rootUser._id, 'Service 2', 200, [], [], 'Unit', 100);
        const service3 = await CreateService.create(rootUser._id, 'Service 3', 300, [], [], 'Unit', 100);
        const service4 = await CreateService.create(rootUser._id, 'Service 4', 400, [], [], 'Unit', 100);
        const service5 = await CreateService.create(rootUser._id, 'Service 5', 500, [], [], 'Unit', 100);
        const dentist = await CreateUserService.create(rootUser._id, { name: 'Dentist', email: 'dentist@gmail.com', phone: '0999999', password: 'password' });
        await SetRoleInBranchService.set(dentist._id, normalBranch._id, [Role.DENTIST]);
        await CreateUserService.create(rootUser._id, { name: 'Staff', email: 'staff@gmail.com', phone: '222222', password: 'password' });
        const staffCustomerCase = await LoginService.login('staff@gmail.com', 'password') as User;
        await SetRoleInBranchService.set(staffCustomerCase._id, normalBranch._id, [Role.CUSTOMER_CARE]);
        return { rootUser, branchMaster, normalBranch, client, services: [service1, service2, service3, service4, service5] as Service[], dentist, staffCustomerCase }
    }

    static async testUpdateTicket() {
        const { rootUser, branchMaster, normalBranch, client, services, dentist, staffCustomerCase } = await this.testCreateTicket();
        const dentist2 = await CreateUserService.create(rootUser._id, { name: 'Dentist2', email: 'dentist2@gmail.com', phone: '09999992', password: 'password' });
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
        const checkUser = await CreateUserService.create(rootUser._id, { name: 'Normal', email: 'normal@gmail.com', phone: '0999999', password: 'password' });
        return { rootUser, branchMaster, normalBranch, checkUser }
    }

    static async testCreateCalendarDentist() {
        const { rootUser, branchMaster, normalBranch } = await this.createNormalBranch();
        const dentist = await CreateUserService.create(rootUser._id, { name: 'Dentist', email: 'dentist@gmail.com', phone: '0999999', password: 'password' });
        await SetRoleInBranchService.set(dentist._id, normalBranch._id, [Role.DENTIST]);
        await CreateUserService.create(rootUser._id, { name: 'Staff', email: 'staff@gmail.com', phone: '0999999111', password: 'password' });
        const staff = await LoginService.login('staff@gmail.com', 'password');
        await SetRoleInBranchService.set(staff._id, normalBranch._id, [Role.CUSTOMER_CARE]);
        return { rootUser, branchMaster, normalBranch, staff, dentist };
    }
}