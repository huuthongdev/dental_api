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
describe('PUT /ticket/dentist-reponsible/:ticketId', () => {
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
    it('Can update ticket dentist reponsible', () => __awaiter(this, void 0, void 0, function* () {
        const oldTicket = yield refs_1.Ticket.findById(ticketId).select(refs_1.modifiedSelect);
        const dataSend = { dentistId: dentist2Id };
        const response = yield supertest_1.default(refs_1.app)
            .put('/ticket/dentist-responsible/' + ticketId).set({ token, branch: normalBranchId }).send(dataSend);
        const { success, result } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(response.status, 200);
        const resExpected = {
            _id: ticketId,
            sid: result.sid,
            client: {
                _id: clientId,
                sid: result.client.sid,
                name: 'Client',
                phone: '0123',
                email: 'client@gmail.com'
            },
            staffCustomerCase: userId,
            dentistResponsible: {
                _id: dentist2Id,
                sid: result.dentistResponsible.sid,
                name: 'Dentist2',
                email: 'dentist2@gmail.com',
                phone: '09999992'
            },
            branchRegister: normalBranchId,
            __v: 0,
            modifieds: [{
                    message: refs_1.ModifieldTicketMessage.CHANGE_DENTIST_RESPONSIBLE,
                    dataBackup: JSON.stringify(oldTicket),
                    updateBy: userId,
                    updateAt: result.modifieds[0].updateAt,
                    _id: result.modifieds[0]._id
                }],
            createAt: result.createAt,
            calendars: [],
            receiptVoucher: [],
            totalAmount: 500,
            items: [{
                    service: {
                        _id: services[0]._id.toString(),
                        sid: result.items[0].service.sid,
                        name: 'Service 1'
                    },
                    qty: 1,
                    _id: result.items[0]._id
                },
                {
                    service: {
                        _id: services[1]._id.toString(),
                        sid: result.items[1].service.sid,
                        name: 'Service 2'
                    },
                    qty: 2,
                    _id: result.items[1]._id
                }],
            status: 'WORKING'
        };
        assert_1.deepEqual(result, resExpected);
    }));
    it('Cannot update with out dentistId', () => __awaiter(this, void 0, void 0, function* () {
        const dataSend = { dentistId: userId };
        const response = yield supertest_1.default(refs_1.app)
            .put('/ticket/dentist-responsible/' + ticketId).set({ token, branch: normalBranchId }).send(dataSend);
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, refs_1.TicketError.DENTIST_INFO_INVALID);
    }));
});
