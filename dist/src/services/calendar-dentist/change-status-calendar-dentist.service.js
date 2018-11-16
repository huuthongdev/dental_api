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
class ChangeStatusCalendarDentistService {
    static validate(userId, calendarDentistId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustBeObjectId(userId, calendarDentistId);
            const oldCanlendarDentist = yield refs_1.CalendarDentist.findById(calendarDentistId).select(refs_1.modifiedSelect);
            refs_1.mustExist(oldCanlendarDentist, refs_1.CalendarDentistError.CANNOT_FINT_CALENDAR_DENTIST);
            const { PENDING, WORKING, DONE } = refs_1.CalendarStatus;
            const calendarStatusArr = [PENDING, WORKING, DONE];
            refs_1.makeSure(calendarStatusArr.includes(status), refs_1.CalendarDentistError.INVALID_CALENDAR_STATUS);
            return oldCanlendarDentist;
        });
    }
    static change(userId, calendarDentistId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldCanlendarDentist = yield this.validate(userId, calendarDentistId, status);
            yield refs_1.CalendarDentist.findByIdAndUpdate(calendarDentistId, { status }, { new: true });
            return yield refs_1.ModifiedService.calendarDentist(calendarDentistId, userId, oldCanlendarDentist);
        });
    }
    static outOfDate(calendarDentistId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield refs_1.CalendarDentist.findByIdAndUpdate(calendarDentistId, { status: refs_1.CalendarStatus.OUT_OF_DATE }, { new: true });
        });
    }
}
exports.ChangeStatusCalendarDentistService = ChangeStatusCalendarDentistService;
