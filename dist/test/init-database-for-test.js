"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const refs_1 = require("../src/refs");
class InititalDatabaseForTest {
    static loginRootAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            const branchMaster = yield refs_1.Branch.findOne({ isMaster: true });
            const rootUser = yield refs_1.LoginService.login(refs_1.ROOT_PHONE, refs_1.DEFAULT_PASSWORD);
            return { rootUser, branchMaster };
        });
    }
    static createNormalBranch() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rootUser, branchMaster } = yield this.loginRootAccount();
            const normalBranch = yield refs_1.CreateBranchService.create(rootUser._id, { name: 'Normal Branch', email: 'normalbranch@gmail.com', phone: '0123', city: 'HCM', district: 'Phu Nhuan', address: 'Address' });
            return { rootUser, branchMaster, normalBranch };
        });
    }
    static createService() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rootUser, branchMaster, normalBranch } = yield this.createNormalBranch();
            const service = yield refs_1.CreateService.create(rootUser._id, { name: 'Service name', suggestedRetailerPrice: 100, basicProcedure: ['Quy trinh'], unit: 'Unit' });
            return { rootUser, branchMaster, service, normalBranch };
        });
    }
    static createProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rootUser, branchMaster, normalBranch } = yield this.createNormalBranch();
            const product = yield refs_1.CreateProductService.create(rootUser._id, { name: 'Product Name', suggestedRetailerPrice: 100, origin: 'VN', unit: 'Unit', cost: 200 });
            return { rootUser, branchMaster, normalBranch, product };
        });
    }
    static createClient() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rootUser, branchMaster, normalBranch } = yield this.createNormalBranch();
            const client = yield refs_1.CreateClientService.create(rootUser._id, { name: 'Client', phone: '0123', email: 'client@gmail.com', birthday: Date.now(), medicalHistory: [], city: 'HCM', district: 'Phu Nhuan', address: '95/54 Huynh Van Banh', homeTown: 'Phan Thiet' });
            return { rootUser, branchMaster, normalBranch, client };
        });
    }
    static testGetAllUserInCurrentBranch() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rootUser, branchMaster, normalBranch } = yield this.createNormalBranch();
            const user1 = yield refs_1.CreateUserService.create(rootUser._id, { name: 'User 1', email: 'user1@gmail.com', phone: '01', password: 'password' });
            const user2 = yield refs_1.CreateUserService.create(rootUser._id, { name: 'User 2', email: 'user2@gmail.com', phone: '02', password: 'password' });
            const user3 = yield refs_1.CreateUserService.create(rootUser._id, { name: 'User 3', email: 'user3@gmail.com', phone: '03', password: 'password' });
            const user4 = yield refs_1.CreateUserService.create(rootUser._id, { name: 'User 4', email: 'user4@gmail.com', phone: '04', password: 'password' });
            const user5 = yield refs_1.CreateUserService.create(rootUser._id, { name: 'User 5', email: 'user5@gmail.com', phone: '05', password: 'password' });
            const user6 = yield refs_1.CreateUserService.create(rootUser._id, { name: 'User 6', email: 'user6@gmail.com', phone: '06', password: 'password' });
            const user7 = yield refs_1.CreateUserService.create(rootUser._id, { name: 'User 7', email: 'user7@gmail.com', phone: '07', password: 'password' });
            yield refs_1.SetRoleInBranchService.set(user1._id, normalBranch._id, [refs_1.Role.CUSTOMER_CARE]);
            yield refs_1.SetRoleInBranchService.set(user2._id, normalBranch._id, [refs_1.Role.DENTIST]);
            yield refs_1.SetRoleInBranchService.set(user3._id, normalBranch._id, [refs_1.Role.DENTISTS_MANAGER]);
            yield refs_1.SetRoleInBranchService.set(user4._id, normalBranch._id, [refs_1.Role.ACCOUNTANT]);
            yield refs_1.SetRoleInBranchService.set(user5._id, normalBranch._id, [refs_1.Role.ACCOUNTANT]);
            yield refs_1.SetRoleInBranchService.set(user6._id, normalBranch._id, [refs_1.Role.ACCOUNTING_MANAGER]);
            yield refs_1.SetRoleInBranchService.set(user7._id, normalBranch._id, [refs_1.Role.DENTIST]);
            yield refs_1.CreateUserService.create(rootUser._id, { name: 'Director', email: 'director@gmail.com', phone: '08', password: 'password' });
            const userDirect = yield refs_1.LoginService.login('08', 'password');
            yield refs_1.SetRoleInBranchService.set(userDirect._id, normalBranch._id, [refs_1.Role.DIRECTOR]);
            return { rootUser, branchMaster, normalBranch, userDirect };
        });
    }
    static testCreateTicket() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rootUser, branchMaster, normalBranch, client } = yield this.createClient();
            const service1 = yield refs_1.CreateService.create(rootUser._id, { name: 'Service 1', suggestedRetailerPrice: 100, unit: 'Unit' });
            const service2 = yield refs_1.CreateService.create(rootUser._id, { name: 'Service 2', suggestedRetailerPrice: 200, unit: 'Unit' });
            const service3 = yield refs_1.CreateService.create(rootUser._id, { name: 'Service 3', suggestedRetailerPrice: 300, unit: 'Unit' });
            const service4 = yield refs_1.CreateService.create(rootUser._id, { name: 'Service 4', suggestedRetailerPrice: 400, unit: 'Unit' });
            const service5 = yield refs_1.CreateService.create(rootUser._id, { name: 'Service 5', suggestedRetailerPrice: 500, unit: 'Unit' });
            const dentist = yield refs_1.CreateUserService.create(rootUser._id, { name: 'Dentist', email: 'dentist@gmail.com', phone: '0999999', password: 'password' });
            yield refs_1.SetRoleInBranchService.set(dentist._id, normalBranch._id, [refs_1.Role.DENTIST]);
            yield refs_1.CreateUserService.create(rootUser._id, { name: 'Staff', email: 'staff@gmail.com', phone: '222222', password: 'password' });
            const staffCustomerCase = yield refs_1.LoginService.login('staff@gmail.com', 'password');
            yield refs_1.SetRoleInBranchService.set(staffCustomerCase._id, normalBranch._id, [refs_1.Role.CUSTOMER_CARE]);
            return { rootUser, branchMaster, normalBranch, client, services: [service1, service2, service3, service4, service5], dentist, staffCustomerCase };
        });
    }
    static testUpdateTicket() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rootUser, branchMaster, normalBranch, client, services, dentist, staffCustomerCase } = yield this.testCreateTicket();
            const dentist2 = yield refs_1.CreateUserService.create(rootUser._id, { name: 'Dentist2', email: 'dentist2@gmail.com', phone: '09999992', password: 'password' });
            yield refs_1.SetRoleInBranchService.set(dentist2._id, normalBranch._id, [refs_1.Role.DENTIST]);
            const items = [{
                    service: services[0]._id,
                    qty: 1
                }, {
                    service: services[1]._id,
                    qty: 2
                }];
            const ticket = yield refs_1.CreateTicketService.create(staffCustomerCase._id, { clientId: client._id, dentistId: dentist._id, branchId: normalBranch._id, items });
            return { ticket, rootUser, branchMaster, normalBranch, client, services, dentist, dentist2, staffCustomerCase };
        });
    }
    static testCheckRoleInBranch() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rootUser, branchMaster, normalBranch } = yield this.createNormalBranch();
            const checkUser = yield refs_1.CreateUserService.create(rootUser._id, { name: 'Normal', email: 'normal@gmail.com', phone: '0999999', password: 'password' });
            return { rootUser, branchMaster, normalBranch, checkUser };
        });
    }
    static testCreateCalendarDentist() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rootUser, branchMaster, normalBranch } = yield this.createNormalBranch();
            const dentist = yield refs_1.CreateUserService.create(rootUser._id, { name: 'Dentist', email: 'dentist@gmail.com', phone: '0999999', password: 'password' });
            yield refs_1.SetRoleInBranchService.set(dentist._id, normalBranch._id, [refs_1.Role.DENTIST]);
            yield refs_1.CreateUserService.create(rootUser._id, { name: 'Staff', email: 'staff@gmail.com', phone: '0999999111', password: 'password' });
            const staff = yield refs_1.LoginService.login('staff@gmail.com', 'password');
            yield refs_1.SetRoleInBranchService.set(staff._id, normalBranch._id, [refs_1.Role.CUSTOMER_CARE]);
            return { rootUser, branchMaster, normalBranch, staff, dentist };
        });
    }
}
exports.InititalDatabaseForTest = InititalDatabaseForTest;
