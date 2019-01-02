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
const assert_1 = require("assert");
const refs_1 = require("../../src/refs");
const init_database_for_test_1 = require("../init-database-for-test");
describe('POST /ticket', () => {
    let token, userId, normalBranchId, clientId, dentistId, services;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        const dataInitial = yield init_database_for_test_1.InititalDatabaseForTest.testCreateTicket();
        token = dataInitial.staffCustomerCase.token.toString();
        userId = dataInitial.staffCustomerCase._id.toString();
        clientId = dataInitial.client._id.toString();
        dentistId = dataInitial.dentist._id.toString();
        services = dataInitial.services;
        normalBranchId = dataInitial.normalBranch._id.toString();
    }));
    it('Can create ticket, service have not service meta', () => __awaiter(this, void 0, void 0, function* () {
        const items = [{
                service: services[0]._id,
                qty: 1
            }, {
                service: services[1]._id,
                qty: 2
            }];
        const totalAmountExpected = services[0].suggestedRetailerPrice * 1 + services[1].suggestedRetailerPrice * 2;
        const dataSend = { clientId, dentistId, items };
        const response = yield supertest_1.default(refs_1.app)
            .post('/ticket').set({ token, branch: normalBranchId }).send(dataSend);
        const { success, result } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(response.status, 200);
        const resExpected = {
            _id: result._id,
            sid: result.sid,
            client: {
                _id: clientId,
                sid: refs_1.SID_START_AT,
                name: 'Client',
                phone: '0123',
                email: 'client@gmail.com'
            },
            staffCustomerCase: result.staffCustomerCase,
            dentistResponsible: {
                _id: dentistId,
                sid: result.dentistResponsible.sid,
                name: 'Dentist',
                email: 'dentist@gmail.com',
                phone: '0999999'
            },
            branchRegister: result.branchRegister,
            __v: 0,
            modifieds: [],
            createAt: result.createAt,
            calendars: [],
            receiptVoucher: [],
            totalAmount: totalAmountExpected,
            items: [{
                    service: {
                        _id: services[0]._id.toString(),
                        sid: services[0].sid,
                        name: 'Service 1'
                    },
                    qty: 1,
                    _id: result.items[0]._id
                },
                {
                    service: {
                        _id: services[1]._id.toString(),
                        sid: services[1].sid,
                        name: 'Service 2'
                    },
                    qty: 2,
                    _id: result.items[1]._id
                }],
            status: 'WORKING'
        };
        assert_1.deepEqual(result, resExpected);
    }));
    it('Can create ticket, service have service meta this branch', () => __awaiter(this, void 0, void 0, function* () {
        const numberServiceMeta = 900;
        yield refs_1.CreateServiceMeta.create(services[0]._id, numberServiceMeta, normalBranchId);
        const items = [{
                service: services[0]._id,
                qty: 1
            }, {
                service: services[1]._id,
                qty: 2
            }];
        const totalAmountExpected = numberServiceMeta * 1 + services[1].suggestedRetailerPrice * 2;
        const dataSend = { clientId, dentistId, items };
        const response = yield supertest_1.default(refs_1.app)
            .post('/ticket').set({ token, branch: normalBranchId }).send(dataSend);
        const { success, result } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(response.status, 200);
        const resExpected = {
            _id: result._id,
            sid: refs_1.SID_START_AT,
            client: {
                _id: clientId,
                sid: refs_1.SID_START_AT,
                name: 'Client',
                phone: '0123',
                email: 'client@gmail.com'
            },
            staffCustomerCase: result.staffCustomerCase,
            dentistResponsible: {
                _id: dentistId,
                sid: refs_1.SID_START_AT + 1,
                name: 'Dentist',
                email: 'dentist@gmail.com',
                phone: '0999999'
            },
            branchRegister: result.branchRegister,
            __v: 0,
            modifieds: [],
            createAt: result.createAt,
            calendars: [],
            receiptVoucher: [],
            totalAmount: totalAmountExpected,
            items: [{
                    service: {
                        _id: services[0]._id.toString(),
                        sid: services[0].sid,
                        name: 'Service 1'
                    },
                    qty: 1,
                    _id: result.items[0]._id
                },
                {
                    service: {
                        _id: services[1]._id.toString(),
                        sid: services[1].sid,
                        name: 'Service 2'
                    },
                    qty: 2,
                    _id: result.items[1]._id
                }],
            status: 'WORKING'
        };
        assert_1.deepEqual(result, resExpected);
    }));
    it('Cannot create ticket with errors required', () => __awaiter(this, void 0, void 0, function* () {
        const items = [{
                service: services[0]._id,
                qty: 1
            }, {
                service: services[1]._id,
                qty: 2
            }];
        const dataSend1 = { clientId: userId, dentistId, items };
        const res1 = yield supertest_1.default(refs_1.app)
            .post('/ticket').set({ token, branch: normalBranchId }).send(dataSend1);
        assert_1.equal(res1.status, 400);
        assert_1.equal(res1.body.success, false);
        assert_1.equal(res1.body.message, refs_1.ClientError.CANNOT_FIND_CLIENT);
        const dataSend2 = { clientId, dentistId: clientId, items };
        const res2 = yield supertest_1.default(refs_1.app)
            .post('/ticket').set({ token, branch: normalBranchId }).send(dataSend2);
        assert_1.equal(res2.status, 400);
        assert_1.equal(res2.body.success, false);
        assert_1.equal(res2.body.message, refs_1.TicketError.DENTIST_INFO_INVALID);
        const dataSend3 = { clientId, dentistId, items: [] };
        const res3 = yield supertest_1.default(refs_1.app)
            .post('/ticket').set({ token, branch: normalBranchId }).send(dataSend3);
        assert_1.equal(res3.status, 400);
        assert_1.equal(res3.body.success, false);
        assert_1.equal(res3.body.message, refs_1.TicketError.ITEMS_MUST_BE_PROVIDED);
    }));
    it('Cannot create ticket when choose dentist dont have role dentist', () => __awaiter(this, void 0, void 0, function* () {
        const items = [{
                service: services[0]._id,
                qty: 1
            }, {
                service: services[1]._id,
                qty: 2
            }];
        const dataSend1 = { clientId, dentistId: userId, items };
        const res1 = yield supertest_1.default(refs_1.app)
            .post('/ticket').set({ token, branch: normalBranchId }).send(dataSend1);
        assert_1.equal(res1.status, 400);
        assert_1.equal(res1.body.success, false);
        assert_1.equal(res1.body.message, refs_1.TicketError.DENTIST_INFO_INVALID);
    }));
});
