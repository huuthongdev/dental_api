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
class GetCalendarDentist {
    static get(dentistId) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustBeObjectId(dentistId);
            const result = yield refs_1.CalendarDentist.find({ dentist: dentistId })
                .populate({
                path: 'ticket',
                select: 'client status',
                populate: {
                    path: 'client',
                    select: 'sid name'
                }
            });
            return { dentistId, calendar: result };
        });
    }
}
exports.GetCalendarDentist = GetCalendarDentist;
