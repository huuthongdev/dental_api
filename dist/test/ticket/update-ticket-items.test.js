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
describe('PUT /ticket/items/:ticketId', () => {
    let ticketId, dentist2Id, token, userId, normalBranchId, clientId, dentistId, services;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        const dataInitial = yield init_database_for_test_1.InititalDatabaseForTest.testUpdateTicket();
        token = dataInitial.staffCustomerCase.token.toString();
        userId = dataInitial.staffCustomerCase._id.toString();
        clientId = dataInitial.client._id.toString();
        dentistId = dataInitial.dentist._id.toString();
        services = dataInitial.services;
        normalBranchId = dataInitial.normalBranch._id.toString();
        ticketId = dataInitial.ticket._id.toString();
        dentist2Id = dataInitial.dentist2._id.toString();
    }));
    it('Can update ticket items', () => __awaiter(this, void 0, void 0, function* () {
        const oldTicket = yield refs_1.Ticket.findById(ticketId).select(refs_1.modifiedSelect);
        const items = [{
                service: services[0]._id,
                qty: 10
            }, {
                service: services[1]._id,
                qty: 3
            }];
        const totalAmountExpected = services[0].suggestedRetailerPrice * 10 + services[1].suggestedRetailerPrice * 3;
        const dataSend = { items };
        const response = yield supertest_1.default(refs_1.app)
            .put('/ticket/items/' + ticketId).set({ token, branch: normalBranchId }).send(dataSend);
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
            staffCustomerCase: userId,
            dentistResponsible: {
                _id: dentistId,
                sid: refs_1.SID_START_AT + 1,
                name: 'Dentist',
                email: 'dentist@gmail.com',
                phone: '0999999'
            },
            branchRegister: normalBranchId,
            __v: 0,
            modifieds: [{
                    message: refs_1.ModifieldTicketMessage.UPDATE_ITEMS,
                    dataBackup: JSON.stringify(oldTicket).toString(),
                    updateBy: userId,
                    updateAt: result.modifieds[0].updateAt,
                    _id: result.modifieds[0]._id
                }],
            createAt: result.createAt,
            calendars: [],
            receiptVoucher: [],
            totalAmount: totalAmountExpected,
            items: [{
                    service: {
                        _id: services[0]._id.toString(),
                        sid: refs_1.SID_START_AT,
                        name: 'Service 1'
                    },
                    qty: 10,
                    _id: result.items[0]._id
                },
                {
                    service: {
                        _id: services[1]._id.toString(),
                        sid: refs_1.SID_START_AT + 1,
                        name: 'Service 2'
                    },
                    qty: 3,
                    _id: result.items[1]._id
                }],
            status: 'WORKING'
        };
        assert_1.deepEqual(result, resExpected);
    }));
    it('Cannot update with out items', () => __awaiter(this, void 0, void 0, function* () {
        const items = [];
        const dataSend = { items };
        const response = yield supertest_1.default(refs_1.app)
            .put('/ticket/items/' + ticketId).set({ token, branch: normalBranchId }).send(dataSend);
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, refs_1.TicketError.ITEMS_MUST_BE_PROVIDED);
    }));
    it('Cannot update with a removed service', () => __awaiter(this, void 0, void 0, function* () {
        const items = [{
                service: services[0]._id,
                qty: 10
            }, {
                service: services[1]._id,
                qty: 3
            }];
        yield refs_1.Service.findByIdAndRemove(services[0]._id);
        const dataSend = { items };
        const response = yield supertest_1.default(refs_1.app)
            .put('/ticket/items/' + ticketId).set({ token, branch: normalBranchId }).send(dataSend);
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, refs_1.ServiceError.CANNOT_FIND_SERVICE);
    }));
});
