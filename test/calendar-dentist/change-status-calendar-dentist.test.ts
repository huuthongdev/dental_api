import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InititalDatabaseForTest } from '../../test/init-database-for-test';
import { app, CalendarDentistError, CreateCalendarDentistService, CalendarStatus } from '../../src/refs';

describe('POST /calendar-dentist', () => {
    let token: string, userId: string, branchId: string, dentistId: string, calendarDentistId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.testCreateCalendarDentist();
        token = dataInitial.staff.token.toString();
        userId = dataInitial.staff._id.toString();
        branchId = dataInitial.normalBranch._id.toString();
        dentistId = dataInitial.dentist._id.toString();
        const startTime = new Date(2018, 11, 2, 20, 0).getTime();
        const endTime = new Date(2018, 11, 2, 20, 30).getTime();
        const calendar = await CreateCalendarDentistService.create(userId, branchId, dentistId, startTime, endTime, 'Tai kham');
        calendarDentistId = calendar._id;
    });

    it('Can change status calendar dentist', async () => {
        const res1 = await request(app)
            .put('/calendar-dentist/change-status/' + calendarDentistId)
            .set({ token, branch: branchId })
            .send({ status: CalendarStatus.WORKING });
        equal(res1.status, 200);
        equal(res1.body.success, true);
        equal(res1.body.result.status, CalendarStatus.WORKING);

        const res2 = await request(app)
            .put('/calendar-dentist/change-status/' + calendarDentistId)
            .set({ token, branch: branchId })
            .send({ status: CalendarStatus.DONE });
        equal(res2.status, 200);
        equal(res2.body.success, true);
        equal(res2.body.result.status, CalendarStatus.DONE);

        const res3 = await request(app)
            .put('/calendar-dentist/change-status/' + calendarDentistId)
            .set({ token, branch: branchId })
            .send({ status: CalendarStatus.PENDING });
        equal(res3.status, 200);
        equal(res3.body.success, true);
        equal(res3.body.result.status, CalendarStatus.PENDING);
    });

    it('Cannot change status calender dentist with errors', async () => {
        const res1 = await request(app)
            .put('/calendar-dentist/change-status/' + calendarDentistId)
            .set({ token, branch: branchId });
            // .send({ status: CalendarStatus.WORKING });
            equal(res1.status, 400);
            equal(res1.body.success, false);
            equal(res1.body.message, CalendarDentistError.INVALID_CALENDAR_STATUS);
    });
});