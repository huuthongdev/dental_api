import { mustBeObjectId, CalendarDentist, mustExist, CalendarDentistError, modifiedSelect, CalendarStatus, ModifiedService, makeSure } from "../../../src/refs";


export class ChangeStatusCalendarDentistService {
    static async validate(userId: string, calendarDentistId: string, status: string) {
        mustBeObjectId(userId, calendarDentistId);
        const oldCanlendarDentist = await CalendarDentist.findById(calendarDentistId).select(modifiedSelect) as CalendarDentist;
        mustExist(oldCanlendarDentist, CalendarDentistError.CANNOT_FINT_CALENDAR_DENTIST);
        const { PENDING, WORKING, DONE } = CalendarStatus;
        const calendarStatusArr = [PENDING, WORKING, DONE];
        makeSure(calendarStatusArr.includes(status as CalendarStatus), CalendarDentistError.INVALID_CALENDAR_STATUS);
        return oldCanlendarDentist;
    }

    static async change(userId: string, calendarDentistId: string, status: string) {
        const oldCanlendarDentist = await this.validate(userId, calendarDentistId, status);
        await CalendarDentist.findByIdAndUpdate(calendarDentistId, { status }, { new: true });
        return await ModifiedService.calendarDentist(calendarDentistId, userId, oldCanlendarDentist);
    }

    static async outOfDate(calendarDentistId: string) {
        return await CalendarDentist.findByIdAndUpdate(calendarDentistId, { status: CalendarStatus.OUT_OF_DATE }, { new: true });
    }
}