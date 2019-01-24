"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const init_database_for_test_1 = require("../../test/init-database-for-test");
const refs_1 = require("../../src/refs");
const bcryptjs_1 = require("bcryptjs");
describe('GET /client-detail/:clientId', () => {
    let token, userId, branchId, normalBranchId, clientId, dentistId;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        const dataInitial = yield init_database_for_test_1.InititalDatabaseForTest.createClient();
        token = dataInitial.rootUser.token.toString();
        userId = dataInitial.rootUser._id.toString();
        branchId = dataInitial.branchMaster._id.toString();
        normalBranchId = dataInitial.normalBranch._id.toString();
        clientId = dataInitial.client._id.toString();
        // Create A dentist
        const dentist = yield refs_1.CreateUserService.create(userId, { name: 'Dentist', email: 'dentis@gmail.com', phone: '0123131203821098', password: yield bcryptjs_1.hash('admin', 8) });
        yield refs_1.SetRoleInBranchService.set(dentist._id, branchId, [refs_1.Role.DENTIST]);
        dentistId = dentist._id;
    }));
    it('Can get client detail data', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(refs_1.app)
            .get('/client/detail/' + clientId).set({ token, branch: branchId });
        const { success, result } = response.body;
        // Create Ticket for this client
    }));
});
