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
    let token, userId, branchId, dentistId, calendarDentistId;
    beforeEach('Prepare data for test', () => __awaiter(this, void 0, void 0, function* () {
        const dataInitial = yield init_database_for_test_1.InititalDatabaseForTest.testCreateCalendarDentist();
        token = dataInitial.staff.token.toString();
        userId = dataInitial.staff._id.toString();
        branchId = dataInitial.normalBranch._id.toString();
        dentistId = dataInitial.dentist._id.toString();
        const startTime = new Date(2018, 11, 2, 20, 0).getTime();
        const endTime = new Date(2018, 11, 2, 20, 30).getTime();
        const calendar = yield refs_1.CreateCalendarDentistService.create(userId, branchId, dentistId, startTime, endTime, 'Tai kham');
        calendarDentistId = calendar._id;
    }));
    it('Can change status calendar dentist', () => __awaiter(this, void 0, void 0, function* () {
        const res1 = yield supertest_1.default(refs_1.app)
            .put('/calendar-dentist/change-status/' + calendarDentistId)
            .set({ token, branch: branchId })
            .send({ status: refs_1.CalendarStatus.WORKING });
        assert_1.equal(res1.status, 200);
        assert_1.equal(res1.body.success, true);
        assert_1.equal(res1.body.result.status, refs_1.CalendarStatus.WORKING);
        const res2 = yield supertest_1.default(refs_1.app)
            .put('/calendar-dentist/change-status/' + calendarDentistId)
            .set({ token, branch: branchId })
            .send({ status: refs_1.CalendarStatus.DONE });
        assert_1.equal(res2.status, 200);
        assert_1.equal(res2.body.success, true);
        assert_1.equal(res2.body.result.status, refs_1.CalendarStatus.DONE);
        const res3 = yield supertest_1.default(refs_1.app)
            .put('/calendar-dentist/change-status/' + calendarDentistId)
            .set({ token, branch: branchId })
            .send({ status: refs_1.CalendarStatus.PENDING });
        assert_1.equal(res3.status, 200);
        assert_1.equal(res3.body.success, true);
        assert_1.equal(res3.body.result.status, refs_1.CalendarStatus.PENDING);
    }));
    it('Cannot change status calender dentist with errors', () => __awaiter(this, void 0, void 0, function* () {
        const res1 = yield supertest_1.default(refs_1.app)
            .put('/calendar-dentist/change-status/' + calendarDentistId)
            .set({ token, branch: branchId });
        // .send({ status: CalendarStatus.WORKING });
        assert_1.equal(res1.status, 400);
        assert_1.equal(res1.body.success, false);
        assert_1.equal(res1.body.message, refs_1.CalendarDentistError.INVALID_CALENDAR_STATUS);
    }));
});
