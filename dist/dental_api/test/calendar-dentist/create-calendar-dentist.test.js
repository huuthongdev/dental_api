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
const init_database_for_test_1 = require("../../test/init-database-for-test");
const refs_1 = require("../../src/refs");
describe('POST /calendar-dentist', () => {
    let token, userId, branchId, dentistId;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        const dataInitial = yield init_database_for_test_1.InititalDatabaseForTest.testCreateCalendarDentist();
        token = dataInitial.staff.token.toString();
        userId = dataInitial.staff._id.toString();
        branchId = dataInitial.normalBranch._id.toString();
        dentistId = dataInitial.dentist._id.toString();
    }));
    it('Can create calendar dentist', () => __awaiter(this, void 0, void 0, function* () {
        const month = 11;
        const startTime = new Date(2018, month + 1, 2, 20, 0).getTime();
        const endTime = new Date(2018, month + 1, 2, 20, 30).getTime();
        const dataSend = {
            startTime,
            endTime,
            dentistId,
            content: 'Tu van cho khach hang'
        };
        const response = yield supertest_1.default(refs_1.app)
            .post('/calendar-dentist')
            .set({ token, branch: branchId }).send(dataSend);
        const { success, result } = response.body;
        assert_1.equal(success, true);
        assert_1.equal(response.status, 200);
        const resExpected = {
            __v: 0,
            sid: result.sid,
            dentist: dentistId,
            startTime: startTime,
            branch: branchId,
            endTime: endTime,
            content: 'Tu van cho khach hang',
            createBy: userId,
            _id: result._id,
            modifieds: [],
            createAt: result.createAt,
            status: 'PENDING'
        };
        assert_1.deepEqual(result, resExpected);
    }));
    it('Can create when had diferent calendar', () => __awaiter(this, void 0, void 0, function* () {
        const month = 11;
        const startTime = new Date(2018, month + 1, 2, 20, 0).getTime();
        const endTime = new Date(2018, month + 1, 2, 20, 30).getTime();
        yield refs_1.CreateCalendarDentistService.create(userId, branchId, dentistId, startTime, endTime, 'Check valid time');
        const dataSend1 = {
            startTime: new Date(2018, month + 1, 2, 17, 0).getTime(),
            endTime: new Date(2018, month + 1, 2, 18, 0).getTime(),
            dentistId,
            content: 'Tu van cho khach hang'
        };
        const res1 = yield supertest_1.default(refs_1.app)
            .post('/calendar-dentist').set({ token, branch: branchId }).send(dataSend1);
        assert_1.equal(res1.body.success, true);
        assert_1.equal(res1.status, 200);
        const dataSend2 = {
            startTime: new Date(2018, month + 1, 2, 20, 31).getTime(),
            endTime: new Date(2018, month + 1, 2, 21, 0).getTime(),
            dentistId,
            content: 'Tu van cho khach hang'
        };
        const res2 = yield supertest_1.default(refs_1.app)
            .post('/calendar-dentist').set({ token, branch: branchId }).send(dataSend2);
        assert_1.equal(res2.body.success, true);
        assert_1.equal(res2.status, 200);
    }));
    it('Cannot create with errors required', () => __awaiter(this, void 0, void 0, function* () {
        const month = 11;
        const startTime = new Date(2018, month + 1, 2, 20, 0).getTime();
        const endTime = new Date(2018, month + 1, 2, 20, 30).getTime();
        const dataSend1 = {
            // startTime,
            endTime,
            dentistId,
            content: 'Tu van cho khach hang'
        };
        const res1 = yield supertest_1.default(refs_1.app)
            .post('/calendar-dentist').set({ token, branch: branchId }).send(dataSend1);
        assert_1.equal(res1.body.success, false);
        assert_1.equal(res1.status, 400);
        assert_1.equal(res1.body.message, refs_1.CalendarDentistError.START_TIME_MUST_BE_PROVIDED);
        const dataSend2 = {
            startTime,
            // endTime,
            dentistId,
            content: 'Tu van cho khach hang'
        };
        const res2 = yield supertest_1.default(refs_1.app)
            .post('/calendar-dentist').set({ token, branch: branchId }).send(dataSend2);
        assert_1.equal(res2.body.success, false);
        assert_1.equal(res2.status, 400);
        assert_1.equal(res2.body.message, refs_1.CalendarDentistError.END_TIME_MUST_BE_PROVIDED);
        const dataSend3 = {
            startTime,
            endTime,
            dentistId: userId,
            content: 'Tu van cho khach hang'
        };
        const res3 = yield supertest_1.default(refs_1.app)
            .post('/calendar-dentist').set({ token, branch: branchId }).send(dataSend3);
        assert_1.equal(res3.body.success, false);
        assert_1.equal(res3.status, 400);
        assert_1.equal(res3.body.message, refs_1.CalendarDentistError.DENTIST_INFO_INVALID);
        const dataSend4 = {
            startTime,
            endTime,
            dentistId,
        };
        const res4 = yield supertest_1.default(refs_1.app)
            .post('/calendar-dentist').set({ token, branch: branchId }).send(dataSend4);
        assert_1.equal(res4.body.success, false);
        assert_1.equal(res4.status, 400);
        assert_1.equal(res4.body.message, refs_1.CalendarDentistError.CONTENT_MUST_BE_PROVIDED);
    }));
    it('Cannot create with invalid time', () => __awaiter(this, void 0, void 0, function* () {
        const month = 11;
        const startTime = new Date(2018, month + 1, 2, 20, 0).getTime();
        const endTime = new Date(2018, month + 1, 2, 22, 15).getTime();
        yield refs_1.CreateCalendarDentistService.create(userId, branchId, dentistId, startTime, endTime, 'Check valid time');
        // TH 1 - Start Time > End Time
        const dataSend1 = {
            startTime,
            endTime: startTime,
            dentistId,
            content: 'Tu van cho khach hang'
        };
        const res1 = yield supertest_1.default(refs_1.app)
            .post('/calendar-dentist').set({ token, branch: branchId }).send(dataSend1);
        assert_1.equal(res1.body.success, false);
        assert_1.equal(res1.status, 400);
        assert_1.equal(res1.body.message, refs_1.CalendarDentistError.INVALID_TIME);
        // TH: 2 -----|||----|||-----
        const dataSend2 = {
            startTime,
            endTime,
            dentistId,
            content: 'Tu van cho khach hang'
        };
        const res2 = yield supertest_1.default(refs_1.app)
            .post('/calendar-dentist').set({ token, branch: branchId }).send(dataSend2);
        assert_1.equal(res2.body.success, false);
        assert_1.equal(res2.status, 400);
        assert_1.equal(res2.body.message, refs_1.CalendarDentistError.INVALID_TIME);
        // TH: 3 -----||--|----|--||-----
        const dataSend3 = {
            startTime: new Date(2018, month + 1, 2, 21, 0).getTime(),
            endTime: new Date(2018, month + 1, 2, 21, 30).getTime(),
            dentistId,
            content: 'Tu van cho khach hang'
        };
        const res3 = yield supertest_1.default(refs_1.app)
            .post('/calendar-dentist').set({ token, branch: branchId }).send(dataSend3);
        assert_1.equal(res3.body.success, false);
        assert_1.equal(res3.status, 400);
        assert_1.equal(res3.body.message, refs_1.CalendarDentistError.INVALID_TIME);
        // TH 4 ---|--||------||----|--
        const dataSend4 = {
            startTime: new Date(2018, month + 1, 2, 18, 0).getTime(),
            endTime: new Date(2018, month + 1, 2, 23, 0).getTime(),
            dentistId,
            content: 'Tu van cho khach hang'
        };
        const res4 = yield supertest_1.default(refs_1.app)
            .post('/calendar-dentist').set({ token, branch: branchId }).send(dataSend4);
        assert_1.equal(res4.body.success, false);
        assert_1.equal(res4.status, 400);
        assert_1.equal(res4.body.message, refs_1.CalendarDentistError.INVALID_TIME);
        // TH 5 ---|--||----|--||------
        const dataSend5 = {
            startTime: new Date(2018, month + 1, 2, 18, 0).getTime(),
            endTime: new Date(2018, month + 1, 2, 21, 0).getTime(),
            dentistId,
            content: 'Tu van cho khach hang'
        };
        const res5 = yield supertest_1.default(refs_1.app)
            .post('/calendar-dentist').set({ token, branch: branchId }).send(dataSend5);
        assert_1.equal(res5.body.success, false);
        assert_1.equal(res5.status, 400);
        assert_1.equal(res5.body.message, refs_1.CalendarDentistError.INVALID_TIME);
        // TH 6 ----||----|--||----|--
        const dataSend6 = {
            startTime: new Date(2018, month + 1, 2, 21, 0).getTime(),
            endTime: new Date(2018, month + 1, 2, 23, 0).getTime(),
            dentistId,
            content: 'Tu van cho khach hang'
        };
        const res6 = yield supertest_1.default(refs_1.app)
            .post('/calendar-dentist').set({ token, branch: branchId }).send(dataSend6);
        assert_1.equal(res6.body.success, false);
        assert_1.equal(res6.status, 400);
        assert_1.equal(res6.body.message, refs_1.CalendarDentistError.INVALID_TIME);
    }));
});
