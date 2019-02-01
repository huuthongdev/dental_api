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
describe('POST /receipt-voucher/ticket/:ticketId', () => {
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
    it('Can create ticket receipt voucher', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(refs_1.app)
            .post('/receipt-voucher/ticket').set({ token, branch: normalBranchId }).send({
            totalPayment: 500,
            content: 'Thanh toan',
            clientId,
            ticketId
        });
        const { success, result } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(response.status, 200);
        const resExpected = {
            _id: ticketId,
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
            modifieds: [{
                    message: refs_1.ModifieldTicketMessage.PAYMENT,
                    dataBackup: result.modifieds[0].dataBackup,
                    updateBy: userId,
                    updateAt: result.modifieds[0].updateAt,
                    _id: result.modifieds[0]._id
                }],
            createAt: result.createAt,
            calendars: [],
            receiptVoucher: [{
                    _id: result.receiptVoucher[0]._id,
                    sid: refs_1.SID_START_AT,
                    totalPayment: 500
                }],
            totalAmount: 500,
            items: result.items,
            status: 'WORKING'
        };
        assert_1.deepEqual(result, resExpected);
    }));
    it('Cannot create with over payment limit', () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest_1.default(refs_1.app)
            .post('/receipt-voucher/ticket').set({ token, branch: normalBranchId }).send({
            totalPayment: 800,
            content: 'Thanh toan',
            clientId,
            ticketId
        });
        const { success, message } = response.body;
        assert_1.equal(success, false);
        assert_1.equal(response.status, 400);
        assert_1.equal(message, refs_1.ReceiptVoucherError.OVER_PAYMENT_LIMIT);
    }));
    it('Cannot create with ticket not existed', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.Ticket.findByIdAndRemove(ticketId);
        const res1 = yield supertest_1.default(refs_1.app)
            .post('/receipt-voucher/ticket').set({ token, branch: normalBranchId }).send({
            totalPayment: 800,
            content: 'Thanh toan',
            clientId,
            ticketId
        });
        assert_1.equal(res1.body.success, false);
        assert_1.equal(res1.status, 400);
        assert_1.equal(res1.body.message, refs_1.TicketError.CANNOT_FIND_TICKET);
    }));
    it('Cannot create with client not existed', () => __awaiter(this, void 0, void 0, function* () {
        yield refs_1.Client.findByIdAndRemove(clientId);
        const res1 = yield supertest_1.default(refs_1.app)
            .post('/receipt-voucher/ticket').set({ token, branch: normalBranchId }).send({
            totalPayment: 800,
            content: 'Thanh toan',
            clientId,
            ticketId
        });
        assert_1.equal(res1.body.success, false);
        assert_1.equal(res1.status, 400);
        assert_1.equal(res1.body.message, refs_1.ClientError.CANNOT_FIND_CLIENT);
    }));
});
