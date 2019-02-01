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
class GetMainDashboardInfoService {
    static get(branchId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get ticket today, get ticket not have calendar (This branch)
            const calendarsToday = yield this.getCalendarsToday(branchId);
            const ticketNotHaveCanlendar = yield this.getTicketNotHaveCalendar(branchId);
            return {
                calendarsToday,
                ticketNotHaveCanlendar
            };
        });
    }
    static getCalendarsToday(branchId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get all calendar of all dentist in this branch
            const calendarsAll = yield refs_1.CalendarDentist.find({ branch: branchId })
                .sort({ startTime: 1 })
                .populate({
                path: 'ticket',
                select: 'client status',
                populate: {
                    path: 'client',
                    select: 'sid name'
                }
            })
                .populate('dentist', 'name');
            // Filter ticket
            const now = new Date().toLocaleDateString('en-GB');
            const calendarsToday = calendarsAll.filter(v => new Date(v.startTime).toLocaleDateString('en-GB') === now);
            return calendarsToday;
        });
    }
    static getTicketNotHaveCalendar(branchId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get các hò sơ điều trị mà chưa được tạo lịch hẹn
            // (1) Get hồ sơ đang điều trị tại chi nhánh đó 
            let ticketInThisBranchId = yield refs_1.Ticket.find({ branchRegister: branchId, status: 'WORKING' })
                .select('sid client dentistResponsible status items totalAmount receiptVoucher calendars')
                .populate('client', 'name email phone')
                .populate('dentistResponsible', 'name email phone')
                .populate('items.service', 'name unit')
                .populate('receiptVoucher')
                .populate('calendars', 'startTime endTime status');
            // (2) Filter hồ sơ chưa có lịch hẹn hoặc có lịch hẹn mà đã quá hạn
            ticketInThisBranchId = ticketInThisBranchId.filter(v => v.calendars.length === 0
                || !v.calendars.find(v => +v.endTime > Date.now()));
            return ticketInThisBranchId;
        });
    }
}
exports.GetMainDashboardInfoService = GetMainDashboardInfoService;
