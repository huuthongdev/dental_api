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
class GetTicketDetailService {
    static get(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            refs_1.mustBeObjectId(_id);
            const ticketInfo = yield refs_1.Ticket.findById(_id)
                .populate('client', 'sid name email phone gender city district address medicalHistory')
                .populate('staffCustomerCase', 'sid name email phone')
                .populate('dentistResponsible', 'sid name email phone')
                .populate('branchRegister', 'sid name email phone')
                .populate('items.service', 'name sid unit')
                .populate({
                path: 'receiptVoucher',
                select: 'sid totalPayment cashier createAt content',
                populate: {
                    path: 'cashier'
                }
            })
                .select({ calendars: false });
            refs_1.mustExist(ticketInfo, refs_1.TicketError.CANNOT_FIND_TICKET);
            let ticket = ticketInfo.toObject();
            const dataRelated = yield this.getDataRelated(_id);
            return Object.assign({}, ticket, dataRelated);
        });
    }
    static getDataRelated(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const calendar = yield refs_1.CalendarDentist.find({ ticket: _id })
                .populate('dentist', 'sid name email phone')
                .populate('createBy', 'sid name email phone');
            return { calendar };
        });
    }
}
exports.GetTicketDetailService = GetTicketDetailService;
