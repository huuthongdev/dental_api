import { mustBeObjectId, mustExist, CalendarDentistError, makeSure, CalendarDentist, ServerError, User, CheckRoleInBranchService, Role, Ticket, TicketError, SID_START_AT } from "../../../src/refs";

export class CreateCalendarDentistService {
    static async validate(userId: string, branchId: string, dentistId: string, startTime: number, endTime: number, content: string, ticketId?: string) {
        mustBeObjectId(userId, dentistId);
        // Must exist
        mustExist(startTime, CalendarDentistError.START_TIME_MUST_BE_PROVIDED);
        mustExist(endTime, CalendarDentistError.END_TIME_MUST_BE_PROVIDED);
        mustExist(content, CalendarDentistError.CONTENT_MUST_BE_PROVIDED);
        const checkRoleDentist = await CheckRoleInBranchService.check(dentistId, branchId, [Role.DENTIST, Role.DENTISTS_MANAGER]);
        makeSure(checkRoleDentist, CalendarDentistError.DENTIST_INFO_INVALID);
        if (ticketId) {
            mustBeObjectId(ticketId);
            const ticket = await Ticket.findById(ticketId);
            mustExist(ticket, TicketError.CANNOT_FIND_TICKET);
        }
        await this.checkTime(startTime, endTime, dentistId);
    }

    static async create(userId: string, branchId: string, dentistId: string, startTime: number, endTime: number, content: string, ticketId?: string) {
        await this.validate(userId, branchId, dentistId, startTime, endTime, content, ticketId);
        const sid = await this.getSid(); 
        const calendarDentist = new CalendarDentist({ sid, branch: branchId, dentist: dentistId, ticket: ticketId, startTime, endTime, content, createBy: userId });
        await calendarDentist.save();
        if (ticketId) {
            await Ticket.findByIdAndUpdate(ticketId, { $addToSet: { calendars: calendarDentist._id } }, { new: true });
        }
        return calendarDentist;
    }

    static async getSid() {
        const maxSid = await CalendarDentist.find({}).sort({ sid: -1 }).limit(1) as CalendarDentist[];
        if (maxSid.length === 0) return SID_START_AT;
        return maxSid[0].sid + 1;
    }

    static async checkTime(startTime: number, endTime: number, dentistId: string) {
        makeSure(startTime < endTime, CalendarDentistError.INVALID_TIME);
        const calendarArrOfDentist = await CalendarDentist.find({ dentist: dentistId }) as CalendarDentist[];
        for (let i = 0; i < calendarArrOfDentist.length; i++) {
            const startTimeCheck = calendarArrOfDentist[i].startTime;
            const endTimeCheck = calendarArrOfDentist[i].endTime;
            const condition1 = startTime <= startTimeCheck && endTime <= startTimeCheck;
            const condition2 = startTime >= endTimeCheck && endTime >= endTimeCheck;
            makeSure(condition1 || condition2, CalendarDentistError.INVALID_TIME);
        }
    }
}