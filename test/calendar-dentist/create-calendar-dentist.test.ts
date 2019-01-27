import request from 'supertest';
import { deepEqual, equal } from 'assert';
import { InititalDatabaseForTest } from '../../test/init-database-for-test';
import { app, CalendarDentistError, CreateCalendarDentistService } from '../../src/refs';

describe('POST /calendar-dentist', () => {
    let token: string, userId: string, branchId: string, dentistId: string;
    beforeEach('Prepare data for test', async () => {
        const dataInitial = await InititalDatabaseForTest.testCreateCalendarDentist();
        token = dataInitial.staff.token.toString();
        userId = dataInitial.staff._id.toString();
        branchId = dataInitial.normalBranch._id.toString();
        dentistId = dataInitial.dentist._id.toString();
    });

    it('Can create calendar dentist', async () => {
        const month = 11;
        const startTime = new Date(2018, month + 1, 2, 20, 0).getTime();
        const endTime = new Date(2018, month + 1, 2, 20, 30).getTime();
        const dataSend = {
            startTime,
            endTime,
            dentistId,
            content: 'Tu van cho khach hang'
        };
        const response = await request(app)
            .post('/calendar-dentist')
            .set({ token, branch: branchId }).send(dataSend);
        const { success, result } = response.body;
        equal(success, true);
        equal(response.status, 200);
        const resExpected: any = {
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
        }
        deepEqual(result, resExpected);
    });

    it('Can create when had diferent calendar', async () => {
        const month = 11;
        const startTime = new Date(2018, month + 1, 2, 20, 0).getTime();
        const endTime = new Date(2018, month + 1, 2, 20, 30).getTime();
        await CreateCalendarDentistService.create(userId, branchId, dentistId, startTime, endTime, 'Check valid time');

        const dataSend1 = {
            startTime: new Date(2018, month + 1, 2, 17, 0).getTime(),
            endTime: new Date(2018, month + 1, 2, 18, 0).getTime(),
            dentistId,
            content: 'Tu van cho khach hang'
        };
        const res1 = await request(app)
            .post('/calendar-dentist').set({ token, branch: branchId }).send(dataSend1);
        equal(res1.body.success, true);
        equal(res1.status, 200);

        const dataSend2 = {
            startTime: new Date(2018, month + 1, 2, 20, 31).getTime(),
            endTime: new Date(2018, month + 1, 2, 21, 0).getTime(),
            dentistId,
            content: 'Tu van cho khach hang'
        };
        const res2 = await request(app)
            .post('/calendar-dentist').set({ token, branch: branchId }).send(dataSend2);
        equal(res2.body.success, true);
        equal(res2.status, 200);

    });

    it('Cannot create with errors required', async () => {
        const month = 11;
        const startTime = new Date(2018, month + 1, 2, 20, 0).getTime();
        const endTime = new Date(2018, month + 1, 2, 20, 30).getTime();

        const dataSend1 = {
            // startTime,
            endTime,
            dentistId,
            content: 'Tu van cho khach hang'
        };
        const res1 = await request(app)
            .post('/calendar-dentist').set({ token, branch: branchId }).send(dataSend1);
        equal(res1.body.success, false);
        equal(res1.status, 400);
        equal(res1.body.message, CalendarDentistError.START_TIME_MUST_BE_PROVIDED);

        const dataSend2 = {
            startTime,
            // endTime,
            dentistId,
            content: 'Tu van cho khach hang'
        };
        const res2 = await request(app)
            .post('/calendar-dentist').set({ token, branch: branchId }).send(dataSend2);
        equal(res2.body.success, false);
        equal(res2.status, 400);
        equal(res2.body.message, CalendarDentistError.END_TIME_MUST_BE_PROVIDED);

        const dataSend3 = {
            startTime,
            endTime,
            dentistId: userId,
            content: 'Tu van cho khach hang'
        };
        const res3 = await request(app)
            .post('/calendar-dentist').set({ token, branch: branchId }).send(dataSend3);
        equal(res3.body.success, false);
        equal(res3.status, 400);
        equal(res3.body.message, CalendarDentistError.DENTIST_INFO_INVALID);

        const dataSend4 = {
            startTime,
            endTime,
            dentistId,
            // content: 'Tu van cho khach hang'
        };
        const res4 = await request(app)
            .post('/calendar-dentist').set({ token, branch: branchId }).send(dataSend4);
        equal(res4.body.success, false);
        equal(res4.status, 400);
        equal(res4.body.message, CalendarDentistError.CONTENT_MUST_BE_PROVIDED);
    });

    it('Cannot create with invalid time', async () => {
        const month = 11;
        const startTime = new Date(2018, month + 1, 2, 20, 0).getTime();
        const endTime = new Date(2018, month + 1, 2, 22, 15).getTime();
        await CreateCalendarDentistService.create(userId, branchId, dentistId, startTime, endTime, 'Check valid time');

        // TH 1 - Start Time > End Time
        const dataSend1 = {
            startTime,
            endTime: startTime,
            dentistId,
            content: 'Tu van cho khach hang'
        };
        const res1 = await request(app)
            .post('/calendar-dentist').set({ token, branch: branchId }).send(dataSend1);
        equal(res1.body.success, false);
        equal(res1.status, 400);
        equal(res1.body.message, CalendarDentistError.INVALID_TIME);


        // TH: 2 -----|||----|||-----
        const dataSend2 = {
            startTime,
            endTime,
            dentistId,
            content: 'Tu van cho khach hang'
        };
        const res2 = await request(app)
            .post('/calendar-dentist').set({ token, branch: branchId }).send(dataSend2);
        equal(res2.body.success, false);
        equal(res2.status, 400);
        equal(res2.body.message, CalendarDentistError.INVALID_TIME);

        // TH: 3 -----||--|----|--||-----
        const dataSend3 = {
            startTime: new Date(2018, month + 1, 2, 21, 0).getTime(),
            endTime: new Date(2018, month + 1, 2, 21, 30).getTime(),
            dentistId,
            content: 'Tu van cho khach hang'
        };
        const res3 = await request(app)
            .post('/calendar-dentist').set({ token, branch: branchId }).send(dataSend3);
        equal(res3.body.success, false);
        equal(res3.status, 400);
        equal(res3.body.message, CalendarDentistError.INVALID_TIME);

        // TH 4 ---|--||------||----|--
        const dataSend4 = {
            startTime: new Date(2018, month + 1, 2, 18, 0).getTime(),
            endTime: new Date(2018, month + 1, 2, 23, 0).getTime(),
            dentistId,
            content: 'Tu van cho khach hang'
        };
        const res4 = await request(app)
            .post('/calendar-dentist').set({ token, branch: branchId }).send(dataSend4);
        equal(res4.body.success, false);
        equal(res4.status, 400);
        equal(res4.body.message, CalendarDentistError.INVALID_TIME);

        // TH 5 ---|--||----|--||------
        const dataSend5 = {
            startTime: new Date(2018, month + 1, 2, 18, 0).getTime(),
            endTime: new Date(2018, month + 1, 2, 21, 0).getTime(),
            dentistId,
            content: 'Tu van cho khach hang'
        };
        const res5 = await request(app)
            .post('/calendar-dentist').set({ token, branch: branchId }).send(dataSend5);
        equal(res5.body.success, false);
        equal(res5.status, 400);
        equal(res5.body.message, CalendarDentistError.INVALID_TIME);

        // TH 6 ----||----|--||----|--
        const dataSend6 = {
            startTime: new Date(2018, month + 1, 2, 21, 0).getTime(),
            endTime: new Date(2018, month + 1, 2, 23, 0).getTime(),
            dentistId,
            content: 'Tu van cho khach hang'
        };
        const res6 = await request(app)
            .post('/calendar-dentist').set({ token, branch: branchId }).send(dataSend6);
        equal(res6.body.success, false);
        equal(res6.status, 400);
        equal(res6.body.message, CalendarDentistError.INVALID_TIME);
    });
});