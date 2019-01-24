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
            return {
                calendarsToday
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
}
exports.GetMainDashboardInfoService = GetMainDashboardInfoService;
