"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const refs_1 = require("../../../src/refs");
class CreateCalendarDentistService {
    static validate(userId, branchId, dentistId, startTime, endTime, content, ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustBeObjectId(userId, dentistId);
            // Must exist
            refs_1.mustExist(startTime, refs_1.CalendarDentistError.START_TIME_MUST_BE_PROVIDED);
            refs_1.mustExist(endTime, refs_1.CalendarDentistError.END_TIME_MUST_BE_PROVIDED);
            refs_1.mustExist(content, refs_1.CalendarDentistError.CONTENT_MUST_BE_PROVIDED);
            const checkRoleDentist = yield refs_1.CheckRoleInBranchService.check(dentistId, branchId, [refs_1.Role.DENTIST, refs_1.Role.DENTISTS_MANAGER]);
            refs_1.makeSure(checkRoleDentist, refs_1.CalendarDentistError.DENTIST_INFO_INVALID);
            if (ticketId) {
                refs_1.mustBeObjectId(ticketId);
                const ticket = yield refs_1.Ticket.findById(ticketId);
                refs_1.mustExist(ticket, refs_1.TicketError.CANNOT_FIND_TICKET);
            }
            yield this.checkTime(startTime, endTime, dentistId);
        });
    }
    static create(userId, branchId, dentistId, startTime, endTime, content, ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validate(userId, branchId, dentistId, startTime, endTime, content, ticketId);
            const calendarDentist = new refs_1.CalendarDentist({ dentist: dentistId, ticket: ticketId, startTime, endTime, content, createBy: userId });
            yield calendarDentist.save();
            if (ticketId) {
                yield refs_1.Ticket.findByIdAndUpdate(ticketId, { $addToSet: { calendars: calendarDentist._id } }, { new: true });
            }
            return calendarDentist;
        });
    }
    static checkTime(startTime, endTime, dentistId) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.makeSure(startTime < endTime, refs_1.CalendarDentistError.INVALID_TIME);
            const calendarArrOfDentist = yield refs_1.CalendarDentist.find({ dentist: dentistId });
            for (let i = 0; i < calendarArrOfDentist.length; i++) {
                const startTimeCheck = calendarArrOfDentist[i].startTime;
                const endTimeCheck = calendarArrOfDentist[i].endTime;
                const condition1 = startTime <= startTimeCheck && endTime <= startTimeCheck;
                const condition2 = startTime >= endTimeCheck && endTime >= endTimeCheck;
                refs_1.makeSure(condition1 || condition2, refs_1.CalendarDentistError.INVALID_TIME);
            }
        });
    }
}
exports.CreateCalendarDentistService = CreateCalendarDentistService;
